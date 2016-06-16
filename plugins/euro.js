/**
 * Euro plugin
 * @module plugins/euro
 */
'use strict';

var $ = require('cheerio');
var http = require('http');

const groupMatcher = /^!euro ([A-F])$/i;
const thirdMatcher = /^!euro (?:3(?:rd)?|third)/i;
const finalsMatcher = /^!euro (8F|QF|SF|F)$/i;
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
    gd: parseInt($(cells[9]).text()),
    points: $(cells[10]).text()
  };
  return res;
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

///////////////////////////////////////////////////////////////////////////////
// Third places in groups /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makeThirdRanking(client, to) {
  let url = 'http://int.soccerway.com/international/europe/european-championships/2016-france/group-stage/r31060/';
  let κ = function(data) {
    let ranks = parseThirdRanks(data);
    let out = groupToString({ranks: ranks, games: []})[0];
    out = out.replace(/3\. /g, '');
    let criteria = 'Ranked by: pts, goal diff, goal scored. After that would be: fair play, uefa ranking. First four go through.';
    client.say(to, '[THIRD PLACES] ' + out + criteria);
  };
  let fail = function() {
    client.say(to, 'Error');
  };
  fetchGroupPage(url, κ, fail);
}
function parseThirdRanks(data) {
  let loaded = $.load(data);

  let thirds = [];
  let tables = loaded('table.leaguetable.sortable.table.detailed-table tbody');
  tables.each(function() {
    let table = $(this);
    let rows = $('tr', table);
    thirds.push(parseRow($(rows[2])));
  });

  thirds.sort(sortThirdRanks);
  return thirds;
}
function sortThirdRanks(team1, team2) {
  if (team1.points > team2.points) return -1;
  if (team1.points < team2.points) return 1;
  if (team1.gd > team2.gd) return -1;
  if (team1.gd < team2.gd) return 1;
  if (team1.gf > team2.gf) return -1;
  if (team1.gf < team2.gf) return 1;
  return 0;
}

///////////////////////////////////////////////////////////////////////////////
/// Final stages //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function getFinalStage(client, to, stage) {
  let url = 'http://int.soccerway.com/international/europe/european-championships/2016-france/s7576/final-stages/';
  let κ = function (data) {
    let allGames = parseStages(data);
    let relevantGames = null;
    switch (stage.toLowerCase()) {
      case '8f':
        relevantGames = allGames.slice(7);
        break;
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

    client.say(to, relevantGames.map(function(g) { return oneGameToString(g); }).join('; '));
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
    'wales': 'WAL'
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
    let thirdMatch = trimmedText.match(thirdMatcher);
    let finalsMatch = trimmedText.match(finalsMatcher);
    let teamMatch = trimmedText.match(teamMatcher);
    if (groupMatch !== null) {
      getGroupInfo(client, to, groupMatch[1].toUpperCase());
    } else if (thirdMatch !== null) {
      makeThirdRanking(client, to);
    } else if (finalsMatch !== null) {
      getFinalStage(client, to, finalsMatch[1]);
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
