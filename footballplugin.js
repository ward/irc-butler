/**
 * Football plugin
 * @module footballplugin
 */
'use strict';

const LS = require('./livescore.js');

function doCountries(client, target) {
  function callback(countries) {
    var reply = 'Countries: ' + countries.join(', ') +
                '. Show competitions in country with: !game -l COUNTRY.';
    client.say(target, reply);
  }
  LS.getCountries(callback);
}

function doCompetitions(country, client, target) {
  function callback(competitions) {
    var reply = 'Competitions in ' + country + ': ' +
                competitions.join(', ') +
                '. Show games with !game -l ' + country + '/COMPETITION.';
    client.say(target, reply);
  }
  LS.getCompetitions(country, callback);
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, message) {
    if (message.startsWith('!games')) {
      message = message.substring(7);
    } else if (message.startsWith('!game')) {
      message = message.substring(6);
    } else {
      return;
    }

    let countrymatch = message.match(/^-l (.+)$/);
    let competitionmatch = message.match(/^-l (.+?)\/(.+)$/);
    if (message === '') {
      doCountries(client, to);
    } else if (countrymatch !== null) {
      doCompetitions(countrymatch[1], client, to);
    } else if (competitionmatch !== null) {
      // List games in competition
    } else {
      // Search and defaults
    }
  });
};
