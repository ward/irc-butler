/**
 * Football plugin
 * @module footballplugin
 */
'use strict';

const LS = require('./livescore.js');

function doCountries(client, target) {
  function callback(countries) {
    var reply = '';
    if (countries.length === 0) {
      reply = 'No games today. Please go out and enjoy the sun, I guess?';
    } else {
      reply = 'Countries: ' + countries.join(', ') +
              '. Show competitions in country with: !game -l COUNTRY.';
    }
    client.say(target, reply);
  }
  LS.getCountries(callback);
}

function doCompetitions(country, client, target) {
  function callback(competitions) {
    var reply = '';
    if (competitions.length === 0) {
      reply = 'No competitions with games found for ' + country + '.';
    } else {
      reply = 'Competitions in ' + country + ': ' +
                competitions.join(', ') +
                '. Show games with !game -l ' + country + '/COMPETITION.';
    }

    client.say(target, reply);
  }
  LS.getCompetitions(country, callback);
}

function doGames(country, competition, client, target) {
  function callback(games) {
    var reply = '';
    if (games.length === 0) {
      reply = 'No games for ' + competition + ' in ' + country + '.';
    } else {
      // Rebuild full games object for gamesToString
      var _games = {};
      _games[country] = {};
      _games[country][competition] = games;
      reply = gamesToString(_games);
    }

    client.say(target, reply);
  }
  LS.getGames(country, competition, callback);
}

function doSearch(str, client, target) {
  function callback(games) {
    // Make sure not too long or short
    var count = 0;
    for (let country of Object.keys(games)) {
      for (let competition of Object.keys(games[country])) {
        count += games[country][competition].length;
      }
    }
    if (count >= 20) {
      client.say(target, 'Too many results (' + count + '). Be more specific.');
      return;
    }
    if (count === 0) {
      client.say(target, 'No results, be less specific.');
    }

    // Results if all good
    var reply = gamesToString(games);
    client.say(target, reply);
  }
  var words = str.split(/\W/);
  LS.search(words, callback);
}

/**
 * Changes a games object into a string ready for IRC.
 *
 * @param {object} games The object holding all the games.
 */
function gamesToString(games) {
  var result = '';
  for (let country of Object.keys(games)) {
    result += formatText('<' + country.toUpperCase() + '>', 'reverse') + ' ';
    for (let competition of Object.keys(games[country])) {
      result += formatText('[' + competition + ']', 'bold') + ' ';
      let _games = games[country][competition].join(' ');
      result += _games + ' ';
    }
  }
  return result;
}

/**
 * Takes some text and formats it for IRC.
 *
 * @param {String} text The text to format.
 * @param {String} how The type of formatting to apply.
 */
function formatText(text, how) {
  var controlCode = '\u0003';
  var resetCode = '\u000f';
  if (how === 'reverse') {
    return controlCode + '\u0016' + text + resetCode;
  } else if (how === 'bold') {
    return controlCode + '\u0002' + text + resetCode;
  } else {
    throw new Error('Incorrect formatting');
  }
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
    } else if (competitionmatch !== null) {
      doGames(competitionmatch[1], competitionmatch[2], client, to);
    } else if (countrymatch !== null) {
      doCompetitions(countrymatch[1], client, to);
    } else {
      doSearch(message, client, to);
    }
  });
};
