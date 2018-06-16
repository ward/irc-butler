/**
 * Fantasy Premier League plugin
 * @module plugins/fantasypl
 */
'use strict';

const util = require('util');

const request = require('request');

let standingsCache;
let lastUpdate = 0;
const CACHE_TIME = 1000 * 60 * 5;

/**
 * Given the dump of fetching the standings, tries to extract relevant info.
 */
function parseStanding(standings) {
  let res = [];
  let previousMatchPosition = 0;
  var usernameStart = standings.indexOf("<div class='user-name'>", previousMatchPosition);
  while (usernameStart !== -1) {
    // Search for the end of username
    let usernameEnd = standings.indexOf('<\\/div>', usernameStart);
    let username = standings.substring(usernameStart, usernameEnd);
    // Search for the points
    let pointsStart = standings.indexOf("<td class='text-center'>", usernameEnd);
    let pointsEnd = standings.indexOf('<\\/td>', pointsStart);
    let points = standings.substring(pointsStart, pointsEnd);
    let result = {
      name: parseUsername(username),
      points: parsePoints(points)
    };
    res.push(result);
    previousMatchPosition = pointsEnd;
    usernameStart = standings.indexOf("<div class='user-name'>", previousMatchPosition);
  }
  return res;
}

/**
 * Helper function for parseStanding
 */
function parseUsername(usernameDump) {
  let cleaned = usernameDump.replace(/\\t/g, '').replace(/\\n/g, '');
  let usernameStart = cleaned.indexOf('>');
  cleaned = cleaned.substring(usernameStart+1);
  // Clean up "captain" info too
  if (cleaned.indexOf('<') > -1) {
    return cleaned.substring(0, cleaned.indexOf('<'));
  }
  return cleaned;
}

/**
 * Helper function for parseStanding
 */
function parsePoints(pointsDump) {
  return pointsDump.replace("<td class='text-center'>", '');
}

/**
 * Make the request to get the standings of the given league
 *
 * Need to set the cookie to something that works!!!
 *
 * TODO: Automatically log in?
 */
function fetchStanding(poolid, κ, κfail) {
  if (Date.now() < lastUpdate + CACHE_TIME) {
    κ(standingsCache);
    return;
  }
  util.log('Updating superbru cache.');
  let options = {
    url: `https://www.superbru.com/worldcup_predictor/ajax/pool_leaderboard.php?pool_id=${poolid}&edition_id=2&round_id=1`,
    headers: {
      'Cookie': ''
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      κfail(error);
      return;
    }
    if (body.indexOf('"data":"Not logged in"') > -1) {
      κfail("Not logged in error");
      return;
    }

    let standings = parseStanding(body);

    if (standings.length === 0) {
      κfail("Standings are empty?");
      return;
    }

    standingsCache = standings;
    lastUpdate = Date.now();
    κ(standings);
  });
}

function showStanding(poolid, client, target) {
  let κ = function(standings) {
    let standingToText = function(standing, idx) {
      return '(' + (idx+1) + ') ' + standing.name + ' ' + standing.points + 'pts';
    };
    let output = standings.map(standingToText).join(' ');
    client.say(target, output);
  };
  let κfail = function(err) {
    util.log(err);
    client.say(target, 'Something went wrong, sorry :/');
  };
  fetchStanding(poolid, κ, κfail);
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, message) {
    message = message.trim();
    if (message.search(/^!(?:predict(?:or)?|[fp]wc|(?:super)?bru)$/i) > -1) {
      // Default action. Before starting probably "new entries"
      showStanding(11859176, client, to);
    }
  });
};
exports.info = {
  id: 'worldcuppredictor',
  version: '0.0.2',
  description: 'World Cup Predictor',
  commands: [
    {
      trigger: '!predict',
      description: 'Shows the rankings for the #reddit-soccer league.'
    }
  ]
};
