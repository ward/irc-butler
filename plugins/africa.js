/**
 * Africa plugin
 * @module plugins/africa
 */
'use strict';

var $ = require('cheerio');
var http = require('http');

const groupMatcher = /^!(?:africa|afcon) ([A-D])$/i;
const finalsMatcher = /^!(?:africa|afcon) (QF|SF|F)(?:inals?)?$/i;

function getGroupInfo(client, to, group) {
  let url = groupToUrl(group);
  if (url === undefined) return;
  let κ = function(data) {
    let parsed = parseGroupPage(data);
    let out = groupToString(parsed);
    for (let i = 0; i < out.length; i++) {
      client.say(to, '[GROUP ' + group + '] ' + out[i]);
    }
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
  let rank = [];
  rows.each(function() {
    let row = $(this);
    rank.push(parseRow(row));
  });

  rows = loaded('table.matches tbody tr');
  let games = [];
  rows.each(function() {
    let row = $(this);
    games.push(parseResultRow(row));
  });

  return {ranks: rank, games: games};
}
function parseRow(row) {
  let cells = $('td', row);
  let res = {
    rank: $(cells[0]).text(),
    team: $(cells[2]).text().replace('Ir…', 'Ireland'), // Hack for Ireland
    played: $(cells[3]).text(),
    win: $(cells[4]).text(),
    draw: $(cells[5]).text(),
    lose: $(cells[6]).text(),
    gf: $(cells[7]).text(),
    ga: $(cells[8]).text(),
    gd: parseInt($(cells[9]).text()),
    points: $(cells[10]).text()
  };
  return res;
}
function parseResultRow(row) {
  let cells = $('td', row);
  // There can be additions, but they are there on both sides, hidden by styling...
  // So remove those not visible and get it over with
  $(cells[3]).find('span.score-addition').not('.addition-visible').remove();
  let cleanscore = $(cells[3]).text().trim().replace(/ |\n/g, '');
  if (cleanscore.indexOf(':') > -1) {
    let hour = parseInt(cleanscore.substring(0,2));
    hour = hour - 1;
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

function groupToString(parsed) {
  let result = [];
  result.push(parsed.ranks.map(oneTeamToString).join('; '));
  result.push(parsed.games.map(oneGameToString).join('; '));
  result = [result.join(' --- ')];
  return result;
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
function oneGameToString(game) {
  if (game.score.search(':') > -1) {
    return game.date + ' ' + game.score + ' ' + teamToFIFACode(game.home) + '-' + teamToFIFACode(game.away);
  }
  return teamToFIFACode(game.home) + ' ' + game.score + ' ' + teamToFIFACode(game.away);
}

function groupToUrl(group) {
  switch (group) {
    case 'A': return 'http://int.soccerway.com/international/africa/africa-cup-of-nations/2017-gabon/group-stage/group-a/g10424/';// eslint-disable-line
    case 'B': return 'http://int.soccerway.com/international/africa/africa-cup-of-nations/2017-gabon/group-stage/group-b/g10425/';// eslint-disable-line
    case 'C': return 'http://int.soccerway.com/international/africa/africa-cup-of-nations/2017-gabon/group-stage/group-c/g10426/';// eslint-disable-line
    case 'D': return 'http://int.soccerway.com/international/africa/africa-cup-of-nations/2017-gabon/group-stage/group-d/g10427/';// eslint-disable-line
  }
}


///////////////////////////////////////////////////////////////////////////////
/// Final stages //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function getFinalStage(client, to, stage) {
  let url = 'http://int.soccerway.com/international/africa/africa-cup-of-nations/2017-gabon/s11664/final-stages/';
  let κ = function (data) {
    let allGames = parseStages(data);
    let relevantGames = null;
    switch (stage.toLowerCase()) {
      case 'qf':
        relevantGames = allGames.slice(3, 7);
        break;
      case 'sf':
        relevantGames = allGames.slice(1, 3);
        break;
      case 'f':
        relevantGames = allGames.slice(0, 1);
        break;
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

function teamToFIFACode(team) {
  let t = team.toLowerCase();
  let info = {
    'algeria': 'ALG',
    'burkina faso': 'BFA',
    'cameroon': 'CMR',
    'congo dr': 'COD',
    'côte d\'ivoire': 'CIV',
    'egypt': 'EGY',
    'gabon': 'GAB',
    'ghana': 'GHA',
    'guinea-bissau': 'GNB',
    'mali': 'MLI',
    'morocco': 'MAR',
    'senegal': 'SEN',
    'togo': 'TOG',
    'tunisia': 'TUN',
    'uganda': 'UGA',
    'zimbabwe': 'ZIM',
  };
  if (t in info) {
    return info[t];
  } else {
    return team;
  }
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let trimmedText = text.trim();
    let groupMatch = trimmedText.match(groupMatcher);
    let finalsMatch = trimmedText.match(finalsMatcher);
    if (groupMatch !== null) {
      getGroupInfo(client, to, groupMatch[1].toUpperCase());
    } else if (finalsMatch !== null) {
      getFinalStage(client, to, finalsMatch[1] || finalsMatch[2]);
    }
  });
};
exports.info = {
  id: 'africa',
  version: '0.0.1',
  description: 'Africa Cup of Nations 2017 information.',
  commands: [
    {
      trigger: '!africa GROUP',
      description: 'Show standings for GROUP (A-D)'
    },
    {
      trigger: '!africa (QF|SF|F)inal',
      description: 'Show the games in the round of 16, quarterfinals, semifinals, or finals.'
    }
  ]
};
