/**
 * Fantasy Premier League plugin
 * @module plugins/fantasypl
 */
'use strict';

const http = require('http');
const https = require('https');

function showNewEntries(id, client, target) {
  let κ = function(res) {
    let newEntries = res['new_entries']['results'].map(e => e.entry_name);
    let amount = newEntries.length;
    newEntries = newEntries.join(', ');
    let name = res['league']['name'];
    client.say(target, amount + ' teams for ' + name + ': ' + newEntries);
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
  })
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, message) {
    message = message.trim();
    if (message === '!fpl') {
      // Default action. Before starting probably "new entries"
      showNewEntries(2191, client, to);
    }
  });
};
exports.info = {
  id: 'fantasypl',
  version: '0.0.1',
  description: 'Fantasy Premier League.',
  commands: [
    {
      trigger: '!fpl',
      description: 'Shows the new entries for the #reddit-soccer league.'
    }
  ]
};
