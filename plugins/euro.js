/**
 * Euro plugin
 * @module plugins/euro
 */
'use strict';

var $ = require('cheerio');
var http = require('http');

const groupMatcher = /^!euro ([A-F])$/i;

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
    team: $(cells[2]).text().replace('Ir…', 'Ireland'), // Hack for Ireland
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
    case 'A': return 'http://int.soccerway.com/international/europe/european-championships/2016-france/group-stage/group-a/g8571/';// eslint-disable-line
    case 'B': return 'http://int.soccerway.com/international/europe/european-championships/2016-france/group-stage/group-b/g8572/';// eslint-disable-line
    case 'C': return 'http://int.soccerway.com/international/europe/european-championships/2016-france/group-stage/group-c/g8573/';// eslint-disable-line
    case 'D': return 'http://int.soccerway.com/international/europe/european-championships/2016-france/group-stage/group-d/g8574/';// eslint-disable-line
    case 'E': return 'http://int.soccerway.com/international/europe/european-championships/2016-france/group-stage/group-e/g8575/';// eslint-disable-line
    case 'F': return 'http://int.soccerway.com/international/europe/european-championships/2016-france/group-stage/group-f/g8576/';
  }
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let trimmedText = text.trim();
    let groupMatch = trimmedText.match(groupMatcher);
    if (groupMatch !== null) {
      getGroupInfo(client, to, groupMatch[1].toUpperCase());
    }
  });
};
exports.info = {
  id: 'euro',
  version: '0.0.1',
  description: 'Euro 2016 information.',
  commands: [
    {
      trigger: '!euro GROUP',
      description: 'Show standings for GROUP (A-F)'
    }
  ]
};
