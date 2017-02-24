/**
 * Elo plugin
 * @module plugins/elo
 */
'use strict';

const fuzzy = require('fuzzy');
const request = require('request');

let eloranks = null;
let eloranks_lastupdate = new Date(0);
const CACHE_TIME = 60 * 60 * 1000;

function fetchElo(κ) {
  let today = new Date();
  let year = today.getUTCFullYear().toString();
  let month = (today.getUTCMonth() + 1).toString();
  if (month.length === 1) {
    month = '0' + month;
  }
  let day = today.getUTCDate().toString();
  if (day.length === 1) {
    day = '0' + day;
  }
  let url = `http://api.clubelo.com/${year}-${month}-${day}`;
  request(url, function(err, response, body) {
    if (err === null && response.statusCode === 200) {
      // Body is a csv file (with header)
      // Rank,Club,Country,Level,Elo,From,To
      let ranking = parseElo(body);
      κ(ranking);
    }
  });
}
function parseElo(csv) {
  let lines = csv.split('\n');
  let ranking = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      continue;
    }
    let rank = lines[i].split(',');
    rank = {
      number: i,
      team: rank[1],
      country: rank[2],
      level: rank[3],
      elo: Math.round(parseFloat(rank[4])),
      from: rank[5],
      to: rank[6]
    };
    ranking.push(rank);
  }
  return ranking;
}
function updateEloIfNeeded(κ) {
  if (new Date() - eloranks_lastupdate > CACHE_TIME) {
    fetchElo(function(ranking) {
      eloranks = ranking;
      eloranks_lastupdate = new Date();
      κ();
    });
  } else {
    κ();
  }
}

function findTeam(team) {
  for (let i = 0; i < eloranks.length; i++) {
    if (eloranks[i].team.toLowerCase() === team.toLowerCase()) {
      return eloranks[i];
    }
  }
  return undefined;
}
function findTeamsFuzzy(team) {
  let options = {
    extract: function(rank) {
      return rank.team;
    }
  };
  let results = fuzzy.filter(team, eloranks, options);
  return results;
}

function rankToString(team) {
  return `${team.team} (#${team.number} - ${team.elo}pts)`;
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let elomatch = text.match(/^!elo (.+)$/i);
    if (elomatch !== null) {
      updateEloIfNeeded(function() {
        let rank = findTeam(elomatch[1]);
        let ranks = findTeamsFuzzy(elomatch[1]);
        if (rank !== undefined) {
          client.say(to, '[ELO] ' + rankToString(rank));
        } else if (ranks.length !== 0) {
          ranks = ranks.map(res => res.original);
          client.say(to, '[ELO] (No exact match found) ' + ranks.map(rankToString).join(', '));
        } else {
          client.say(to, '[ELO] No results found.');
        }
      });
    }
  });
};
exports.info = {
  id: 'elo',
  version: '0.0.1',
  description: 'Elo rankings',
  commands: [
    {
      trigger: '!elo TEAM',
      description: 'Returns the Elo rating and its ranking for a team.'
    }
  ]
};
