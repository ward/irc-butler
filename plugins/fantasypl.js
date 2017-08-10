/**
 * Fantasy Premier League plugin
 * @module plugins/fantasypl
 */
'use strict';

const http = require('http');
const https = require('https');

function showStandings(id, client, target) {
  let κ = function(res) {
    // results is an array of the fpl teams
    let results = res['standings']['results'];
    let name = res['league']['name'];
    let entryToText = function(entry, _idx) {
      return '(' + entry.rank + ') ' + entry.entry_name + ' ' + entry.total + 'pts';
    };
    let output = results.slice(0, 15).map(entryToText).join(' ');
    output = '[' + name + '] ' + output;
    client.say(target, output);
  };
  let κfail = function(err) {
    client.say(target, 'Something went wrong --- ' + err);
  };
  fetchLeagueClassicStandings(id, κ, κfail);
}

function fetchLeagueClassicStandings(id, κ, κfail) {
  const url = 'https://fantasy.premierleague.com/drf/leagues-classic-standings/'
              + id;
  https.get(url, function(response) {
    if (response.statusCode !== 200) {
      κfail('Incorrect statusCode: ' + response.statusCode + ' (' + http.STATUS_CODES[response.statusCode] + ')');
    } else {
      let data = '';
      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        κ(JSON.parse(data));
      });
    }
  }).on('error', function() {
    κfail('https.get() error');
  });
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, message) {
    message = message.trim();
    if (message.search(/^!fpl$/i) > -1) {
      // Default action. Before starting probably "new entries"
      showStandings(188337, client, to);
    }
  });
};
exports.info = {
  id: 'fantasypl',
  version: '0.0.2',
  description: 'Fantasy Premier League.',
  commands: [
    {
      trigger: '!fpl',
      description: 'Shows the rankings for the #reddit-soccer league.'
    }
  ]
};
