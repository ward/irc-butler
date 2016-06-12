/**
 * Euro plugin
 * @module plugins/euro
 */
'use strict';

var $ = require('cheerio');
var http = require('http');

const groupMatcher = /^!euro ([A-F])$/i;
const teamMatcher = /^!euro (.+)$/i;

function getGroupInfo(client, to, group) {
  let url = groupToUrl(group);
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
    gd: $(cells[9]).text(),
    points: $(cells[10]).text()
  };
  return res;
}
function parseResultRow(row) {
  let cells = $('td', row);
  let res = {
    date: $(cells[1]).text().trim().replace('/16', ''),
    home: $(cells[2]).text().trim(),
    score: $(cells[3]).text().trim().replace(/ /g, ''),
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
  let result = '';
  if (game.score.search(':') > -1) {
    result = game.date + ' ';//'(' + game.date + ') ';
  }
  result += teamToFIFACode(game.home) + ' ' + game.score + ' ' + teamToFIFACode(game.away);
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

/**
 * Temporary solution, what about reaching next rounds?
 */
function teamToGroup(team) {
  switch (team.toLowerCase()) {
    case 'albania':
    case 'france':
    case 'fra':
    case 'romania':
    case 'switzerland':
      return 'A';
    case 'england':
    case 'eng':
    case 'russia':
    case 'rus':
    case 'slovakia':
    case 'slo':
    case 'svk':
    case 'wales':
    case 'wal':
    case 'wls':
      return 'B';
    case 'germany':
    case 'ger':
    case 'deu':
    case 'northern ireland':
    case 'nir':
    case 'nil':
    case 'poland':
    case 'pol':
    case 'ukraine':
    case 'ukr':
      return 'C';
    case 'croatia':
    case 'cro':
    case 'czech republic':
    case 'cze':
    case 'czr':
    case 'spain':
    case 'esp':
    case 'spa':
    case 'turkey':
    case 'tur':
    case 'turk':
      return 'D';
    case 'belgium':
    case 'bel':
    case 'italy':
    case 'ita':
    case 'republic of ireland':
    case 'roi':
    case 'sweden':
    case 'swe':
      return 'E';
    case 'austria':
    case 'aus':
    case 'hungary':
    case 'hun':
    case 'iceland':
    case 'ice':
    case 'portugal':
    case 'por':
      return 'F';
  }
}
function teamToFIFACode(team) {
  let t = team.toLowerCase();
  let info = {
    'albania': 'ALB',
    'austria': 'AUT',
    'belgium': 'BEL',
    'croatia': 'CRO',
    'czech republic': 'CZE',
    'england': 'ENG',
    'france': 'FRA',
    'germany': 'GER',
    'hungary': 'HUN',
    'iceland': 'ISL',
    'italy': 'ITA',
    'northern ireland': 'NIR',
    'poland': 'POL',
    'portugal': 'POR',
    'republic of ir…': 'IRL',
    'romania': 'ROU',
    'russia': 'RUS',
    'slovakia': 'SVK',
    'spain': 'ESP',
    'sweden': 'SWE',
    'switzerland': 'SUI',
    'turkey': 'TUR',
    'ukraine': 'UKR',
    'wales': 'WAL',
  };
  return info[t];
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let trimmedText = text.trim();
    let groupMatch = trimmedText.match(groupMatcher);
    let teamMatch = trimmedText.match(teamMatcher);
    if (groupMatch !== null) {
      getGroupInfo(client, to, groupMatch[1].toUpperCase());
    } else if (teamMatch !== null) {
      getGroupInfo(client, to, teamToGroup(teamMatch[1]));
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
    },
    {
      trigger: '!euro TEAM',
      description: 'Show group for TEAM'
    }
  ]
};
