/**
 * Livescore module
 * @module plugins/football-livescore
 */

'use strict';

var util = require('util');
var livescorecrypt = require('./football-livescore-crypt.js');
var request = require('request');

/** How long the data should be cached in milliseconds. */
const CACHE_DURATION = 60 * 1000;

/**
 * Object with country names as keys. The countries are themselves objects
 * with competitions as keys. These hold arrays of games.
 */
var games = {};
/**
 * Last time the data from livescore.com was fetched.
 */
var lastUpdate = new Date(0);

/**
 * One game and the information describing it.
 * Possible future addendum: country and competition.
 */
class Game {
  constructor(time, home, away, score) {
    if (time === undefined || home === undefined
        || away === undefined || score === undefined) {
      console.error(time);
      console.error(home);
      console.error(away);
      console.error(score);
    }
    this.time = time;
    this.home = home;
    this.away = away;
    this.score = score;
  }

  toString() {
    return '(' + this.time + ') ' + this.home + ' ' +
            this.score + ' ' + this.away;
  }
}

/**
 * Asynchronous fetching of the livescore.com data.
 *
 * @param {function} success Callback to be called with the HTML if successful.
 * @param {function} failure Callback to be called if it failed. (no arg)
 */
function fetchLivescore(success, failure) {
  var livescoreoptions = {
    method: 'GET',
    uri: 'https://prod-public-api.livescore.com/v1/api/react/date/soccer/20201014/0.00',
    gzip: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0',
    },
  };
  request(livescoreoptions, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      success(body);
    } else {
      console.error("fetchLivescore. error:");
      console.error(error);
      console.error("fetchLivescore. response:");
      console.error(response.statusCode);

      failure();
    }
  });
}

function parseLivescoreJSON(data) {
  games = {};
  let decrypted;
  let obj;
  try {
    obj = JSON.parse(data);
  } catch (e) {
    try {
      decrypted = livescorecrypt.CryptUtil.decrypt(data);
      obj = JSON.parse(decrypted);
    } catch (e) {
      console.error('Failed to decrypt or JSON parse livescore data');
      console.error(e);
      return;
    }
  }
  for (let i = 0; i < obj['Stages'].length; i++) {
    if (obj['Stages'][i]['Events'] === undefined) {
      continue;
    }
    let country = obj['Stages'][i]['Cnm'];
    let competition = obj['Stages'][i]['Snm'];
    games[country] = games[country] || {};
    games[country][competition] = games[country][competition] || [];

    let events = obj['Stages'][i]['Events'];
    for (let j = 0; j < events.length; j++) {
      // Eps has the ingame time
      let time = events[j]['Eps'];
      // If NS, it did not start yet
      if (time === 'NS') {
        time = events[j]['Esd'].toString().substr(8, 4);
      }
      let home = events[j]['T1'][0]['Nm'];
      let away = events[j]['T2'][0]['Nm'];
      // Tr1 and Tr2 hold the goals
      let score = '? - ?';
      if (events[j].hasOwnProperty('Tr1') && events[j].hasOwnProperty('Tr2')) {
        score = events[j]['Tr1'] + ' - ' + events[j]['Tr2'];
      }
      let game = new Game(time, home, away, score);
      games[country][competition].push(game);
    }
  }
  Object.freeze(games);
}

/**
 * Asynchronous function as it potentially fetches internet data.
 * If time for an update, run an update.
 *
 * @param {function} success Callback if correctly updated or no need for it.
 * @param {function} failure Callback if failed to update.
 */
function update(success, failure) {
  if (new Date() - lastUpdate > CACHE_DURATION) {
    util.log('Cache invalidated, running update.');
    var κ = function(data) {
      parseLivescoreJSON(data);
      lastUpdate = new Date();
      success();
    };
    fetchLivescore(κ, failure);
  } else {
    success();
  }
}

/**
 * Check objects keys to see if there is a case insensitive match to the given
 * string.
 *
 * @return {String} The actual key in the object
 * @return {undefined} If no matching key
 */
function caseInsensitiveKeySearch(object, key) {
  var _key = key.toLowerCase();
  for (let k of Object.keys(object)) {
    if (k.toLowerCase() === _key) {
      return k;
    }
  }
}


/**
 * EXPORTS
 */

/**
 * Gets all the games available in a big object categorised by country and
 * competition.
 *
 * @param {function} callback Function to be called with the resulting games
 *                            objects.
 */
exports.getAllGames = function(callback) {
  var failure = function() {
    callback({});
  };
  var success = function() {
    callback(games);
  };
  update(success, failure);
};
/**
 * Gets a list of the countries available.
 * Calls the next function with an array of countries.
 *
 * @param {function} callback Function to be called with an array of strings
 *                            of countries.
 */
exports.getCountries = function(callback) {
  var failure = function() {
    callback([]);
  };
  var success = function() {
    callback(Object.keys(games));
  };
  update(success, failure);
};
/**
 * Gets a list of the competitions available in a certain country.
 * Calls the next function with an array of competitions for the country.
 *
 * @param {String} country Name for which you want to see competitions, case
 *                          insensitive.
 * @param {function} callback Function to be called with an array of the
 *                            competitions.
 */
exports.getCompetitions = function(country, callback) {
  var failure = function() {
    callback([]);
  };
  var success = function() {
    var _country = caseInsensitiveKeySearch(games, country);
    if (_country !== undefined) {
      callback(Object.keys(games[_country]));
    } else {
      callback([]);
    }
  };
  update(success, failure);
};
/**
 * Gets a list of the games in a competition in a country.
 * Calls the next function with an array of Game objects.
 *
 * @param {String} country Name in which the competition resides.
 * @param {String} competition Name of competition whose games should be
 *                              fetched.
 * @param {function} callback Function to be called with array of the games.
 */
exports.getGames = function(country, competition, callback) {
  var failure = function() {
    callback([]);
  };
  var success = function() {
    var _country = caseInsensitiveKeySearch(games, country);
    if (_country !== undefined) {
      var _competition = caseInsensitiveKeySearch(games[_country], competition);
      if (_competition !== undefined) {
        callback(games[_country][_competition]);
      } else {
        callback([]);
      }
    } else {
      callback([]);
    }
  };
  update(success, failure);
};
/**
 * Search the games for any matches.
 *
 * @param {array} words Several strings to match against
 * @param {function} callback Called with the games matching all strings (in
 *                            teams, competition, or country)
 */
exports.search = function(words, callback) {
  var failure = function() {
    callback([]);
  };
  var success = function() {
    var _words = words.map(function(w) { return w.toLowerCase(); });
    var results = {};
    for (let country of Object.keys(games)) {
      let _country = country.toLowerCase();

      // If all words matched by country, add entire country.
      let matcher = function(word) {
        return _country.includes(word);
      };
      if (_words.every(matcher)) {
        results[country] = games[country];
        continue;
      }

      for (let competition of Object.keys(games[country])) {
        let _competition = competition.toLowerCase();

        // If all words matched country or competition, add entire competition.
        let matcher = function(word) {
          return _country.includes(word) || _competition.includes(word);
        };
        if (_words.every(matcher)) {
          results[country] = results[country] || {};
          results[country][competition] = games[country][competition];
          continue;
        }

        for (let game of games[country][competition]) {
          // If all words matched anything, add that game.
          let matcher = function(word) {
            return _country.includes(word) || _competition.includes(word) ||
                    game.home.toLowerCase().includes(word) ||
                    game.away.toLowerCase().includes(word);
          };
          if (_words.every(matcher)) {
            results[country] = results[country] || {};
            results[country][competition] = results[country][competition] || [];
            results[country][competition].push(game);
          }
        }
      }
    }

    callback(results);
  };
  update(success, failure);
};
