/**
 * Copa plugin
 * @module plugins/copa
 */
'use strict';

var $ = require('cheerio');
var http = require('http');

const groupMatcher = /^!copa ([A-D])$/i;
const finalsMatcher = /^!copa (QF|SF|3r?d?|F)(?:inals?)?$/i;

function getGroupInfo(client, to, group) {
  let url = groupToUrl(group);
  let κ = function(data) {
    let parsed = parseGroupPage(data);
    let out = groupToString(parsed);
    client.say(to, '[GROUP ' + group + '] ' + out);
  };
  let fail = function() {
    client.say(to, 'Error');
  };
  fetchGroupPage(url, κ, fail);
}

function fetchGroupPage(url, κ, fail) {
  http.get(url, function(response) {
    let data = '';
    response.on('data', function(chunk) {
      data += chunk;
    });
    response.on('end', function() {
      κ(data);
    });
  }).on('error', function() {
    fail();
  });
}

function parseGroupPage(data) {
  let loaded = $.load(data);
  let rows = loaded('table.leaguetable.sortable.table.detailed-table tbody tr');
  let result = [];
  rows.each(function() {
    let row = $(this);
    result.push(parseRow(row));
  });
  return result;
}
function parseRow(row) {
  let cells = $('td', row);
  let res = {
    rank: $(cells[0]).text(),
    team: $(cells[2]).text(),
    played: $(cells[3]).text(),
    win: $(cells[4]).text(),
    draw: $(cells[5]).text(),
    lose: $(cells[6]).text(),
    gf: $(cells[7]).text(),
    ga: $(cells[8]).text(),
    gd: $(cells[9]).text(),
    points: $(cells[10]).text()
  };
  return res;
}

function groupToString(parsed) {
  return parsed.map(oneTeamToString).join('; ');
}
function oneTeamToString(team) {
  let result =
    team.rank +
    '. ' +
    team.team.toUpperCase() +
    ' ' +
    team.points +
    'pts ' +
    team.win + '-' + team.draw + '-' + team.lose +
    ' ' +
    team.gf + '-' + team.ga;
  return result;
}

function groupToUrl(group) {
  switch (group) {
    case 'A': return 'http://int.soccerway.com/international/south-america/copa-america/2016-usa/group-stage/group-a/g9342/';
    case 'B': return 'http://int.soccerway.com/international/south-america/copa-america/2016-usa/group-stage/group-b/g9343/';
    case 'C': return 'http://int.soccerway.com/international/south-america/copa-america/2016-usa/group-stage/group-c/g9344/';
    case 'D': return 'http://int.soccerway.com/international/south-america/copa-america/2016-usa/group-stage/group-d/g9345/';
  }
}

///////////////////////////////////////////////////////////////////////////////
/// Final stages //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function getFinalStage(client, to, stage) {
  let url = 'http://int.soccerway.com/international/south-america/copa-america/2016-usa/s11927/final-stages/';
  let κ = function (data) {
    let allGames = parseStages(data);
    let relevantGames = null;
    switch (stage.toLowerCase()) {
      case 'qf':
        relevantGames = allGames.slice(4, 8);
        break;
      case 'sf':
        relevantGames = allGames.slice(2, 4);
        break;
      case '3':
      case '3r':
      case '3d':
      case '3rd':
        relevantGames = allGames.slice(1, 2);
        break;
      case 'f':
        relevantGames = allGames.slice(0, 1);
        break;
      default:
        client.say(to, 'Error: no such stage found');
        return;
    }

    client.say(to, '[' + stage.toUpperCase() + '] ' + relevantGames.map(function(g) { return oneGameToString(g); }).join('; '));
  };
  let fail = function() {
    client.say(to, 'Error');
  };
  fetchGroupPage(url, κ, fail);
}
function parseStages(data) {
  let loaded = $.load(data);

  let tables = loaded('table.matches tbody');
  let games = [];
  tables.each(function() {
    let table = $(this);
    let rows = $('tr', table);
    rows.each(function() {
      let row = $(this);
      games.push(parseResultRow(row));
    });
  });
  return games;
}
function parseResultRow(row) {
  let cells = $('td', row);
  let cleanscore = $(cells[3]).text().trim().replace(/ /g, '');
  if (cleanscore.indexOf(':') > -1) {
    let hour = parseInt(cleanscore.substring(0,2));
    hour = hour - 2;
    cleanscore = hour + cleanscore.substring(2);
  }
  let res = {
    date: $(cells[1]).text().trim().replace('/16', ''),
    home: $(cells[2]).text().trim(),
    score: cleanscore,
    away: $(cells[4]).text().trim()
  };
  return res;
}

function oneGameToString(game) {
  let result = '';
  if (game.score.search(':') > -1) {
    result = game.date + ' ';//'(' + game.date + ') ';
  }
  result += game.home + ' ' + game.score + ' ' + game.away;
  return result;
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let trimmedText = text.trim();
    let groupMatch = trimmedText.match(groupMatcher);
    let finalsMatch = trimmedText.match(finalsMatcher);
    if (groupMatch !== null) {
      getGroupInfo(client, to, groupMatch[1].toUpperCase());
    } else if (finalsMatch !== null) {
      getFinalStage(client, to, finalsMatch[1]);
    }
  });
};
exports.info = {
  id: 'copa',
  version: '0.0.1',
  description: 'Copa America Centenario information.',
  commands: [
    {
      trigger: '!copa GROUP',
      description: 'Show standings for GROUP (A-D)'
    }/*,
    {
      trigger: '!euro TEAM',
      description: 'Show group for TEAM'
    }*/
  ]
};
