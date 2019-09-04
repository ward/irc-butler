/**
 * Football plugin
 * @module plugins/football
 */
'use strict';

const LS = require('./football-livescore.js');
const ircColors = require('irc-colors');

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
 * Takes a country and gets all the games from all competitions from said
 * country.
 * Particularly of use when dealing with something like Champions League.
 */
function doAllFromCountry(country, client, target) {
  var result = {};
  var foundSomething = false;
  result[country] = {};
  function callback(competitions) {
    if (competitions.length > 0) {
      foundSomething = true;
      let competition = competitions.shift();
      let κ = function(games) {
        result[country][competition] = games;
        callback(competitions);
      };
      LS.getGames(country, competition, κ);
    } else {
      // Handled every competition for this country

      let reply = 'No games for ' + country + '.';
      if (foundSomething) {
        reply = gamesToString(result);
      }
      client.say(target, reply);
    }
  }
  LS.getCompetitions(country, callback);
}

/**
 * Changes a games object into a string ready for IRC.
 *
 * @param {object} games The object holding all the games.
 */
function gamesToString(games) {
  var result = '';
  for (let country of Object.keys(games)) {
    result += ircColors.italic('<' + country.toUpperCase() + '>') + ' ';
    for (let competition of Object.keys(games[country])) {
      result += ircColors.bold('[' + competition + ']') + ' ';
      let _games = games[country][competition].join(' ');
      result += _games + ' ';
    }
  }
  return result;
}

const gameTrigger = /^!game/i;
const gamesTrigger = /^!games/i;
const countryMatcher = /^-l (.+)$/i;
const competitionMatcher = /^-l (.+?)\/(.+)$/i;
// Men trigger
// const wcShortcut = /^w(?:orld)?[. -]*c(?:up)?$/i;
// Female trigger
const wcShortcut = /^(?:w(?:omen)?[. -]*)?w(?:orld)?[. -]*c(?:up)?$/i;
const clShortcut = /^u?cl$/i;
const elShortcut = /^el$/i;
const eplShortcut = /^epl$/i;
const ligaShortcut = /^(?:la ?)?liga$/i;
const bundesShortcut = /^bundes(?:liga)?$/i;
const mlsShortcut = /^mls$/i;
const serieaShortcut = /^serie(?: |-)a$/i;

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, message) {
    message = message.trim();

    if (message.toLowerCase() === '!genk') {
      doSearch('genk', client, to);
      return;
    }

    if (message.search(gamesTrigger) > -1) {
      message = message.substring(7);
    } else if (message.search(gameTrigger) > -1) {
      message = message.substring(6);
    } else {
      return;
    }

    let countrymatch = message.match(countryMatcher);
    let competitionmatch = message.match(competitionMatcher);
    if (message === '') {
      doCountries(client, to);
    // } else if (message.search(wcShortcut) > -1) {
    //   doAllFromCountry('World Cup Women', client, to);
    } else if (message.search(clShortcut) > -1) {
      doAllFromCountry('Champions League', client, to);
    } else if (message.search(elShortcut) > -1) {
      doAllFromCountry('Europa League', client, to);
    } else if (message.search(eplShortcut) > -1) {
      doGames('England', 'Premier League', client, to);
    } else if (message.search(ligaShortcut) > -1) {
      doGames('Spain', 'LaLiga Santander', client, to);
    } else if (message.search(bundesShortcut) > -1) {
      doGames('Germany', 'Bundesliga', client, to);
    } else if (message.search(serieaShortcut) > -1) {
      doGames('Italy', 'Serie A', client, to);
    } else if (message.search(mlsShortcut) > -1) {
      // Use search here instead of doGames since MLS can also have playoffs.
      // These playoffs are in USA>Major League Soccer:: play-off
      doSearch('Major League Soccer', client, to);
      //doGames('USA', 'Major League Soccer', client, to);
    } else if (competitionmatch !== null) {
      doGames(competitionmatch[1], competitionmatch[2], client, to);
    } else if (countrymatch !== null) {
      doCompetitions(countrymatch[1], client, to);
    } else {
      doSearch(message, client, to);
    }
  });
};
exports.info = {
  id: 'football',
  version: '0.0.1',
  description: 'Keeps you up to date with football scores.',
  commands: [
    {
      trigger: '!game',
      description: 'Lists all available countries'
    },
    {
      trigger: '!game -l COUNTRY',
      description: 'Lists competitions in a country'
    },
    {
      trigger: '!game -l COUNTRY/COMPETITION',
      description: 'Lists games in a competition within a country. ' +
                   'The / is the separator.'
    },
    {
      trigger: '!game SHORTCUT',
      description: 'Some competitions get a shortcut. Currently: ' +
                   'EPL, Liga, CL, EL, Bundes, MLS.'
    },
    {
      trigger: '!game SEARCHTERMS',
      description: 'Uses the search terms (split by spaces) to look for ' +
                   'games. Matches can be made in team names, competitions, ' +
                   'or countries.'
    }
  ]
};
