/**
 * Fantasy Premier League plugin
 * @module plugins/fantasypl
 */
'use strict';

const request = require('request');

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
  const opts = {
  'uri': 'https://fantasy.premierleague.com/api/leagues-classic/'
              + id + '/standings/',
    'gzip': true,
    'headers': {
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:69.0) Gecko/20100101 Firefox/69.0',
    }
  };
  request(opts, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      try {
      κ(JSON.parse(body));
      } catch (e) {
        κfail(e);
      }
    } else {
      console.log(error);
      κfail(error);
    }
  });
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, message) {
    message = message.trim();
    if (message.search(/^!fpl$/i) > -1) {
      // Default action. Before starting probably "new entries"
      showStandings(43381, client, to);
    }
  });
};
exports.info = {
  id: 'fantasypl',
  version: '0.0.3',
  description: 'Fantasy Premier League.',
  commands: [
    {
      trigger: '!fpl',
      description: 'Shows the rankings for the #reddit-soccer league.'
    }
  ]
};
