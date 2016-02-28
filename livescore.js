/**
 * Livescore module
 * @module livescore
 */

'use strict';

var $ = require('cheerio');
var http = require('http');

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
  var livescoreurl = 'http://www.livescore.com/';
  http.get(livescoreurl, function(response) {
    var data = '';
    response.on('data', function(chunk) {
      data += chunk;
    });
    response.on('end', function() {
      success(data);
    });
  }).on('error', function() {
    failure();
  });
}

/**
 * Parses HTML of livescore.com and populates the `games` variable.
 *
 * @param {string} data HTML as a string
 */
function parseLivescore(data) {
  var parsed = $.load(data);
  var divcontent = parsed('div.content');

  games = {};
  var country = '';
  var competition = '';

  $('div.row, div.row-gray', divcontent).each(function() {
    var row = $(this);
    if (row.hasClass('row') && row.hasClass('row-tall') &&
          row.hasClass('mt4')) {
      // Country/competition header
      var leagueinfo = $('div.left', this);
      var atags = $('a', leagueinfo[0]);
      country = $(atags[0]).text().trim();
      competition = $(atags[1]).text().trim();
      if (!games.hasOwnProperty(country)) {
        games[country] = {};
      }
      if (!games[country].hasOwnProperty(competition)) {
        games[country][competition] = [];
      }
    } else if (row.hasClass('row-gray')) {
      // Actual game entry
      var time = $($('div.min', row)[0]).text().trim();
      var home = $($('div.name', row)[0]).text().trim();
      var score = $($('div.sco', row)[0]).text().trim();
      var away = $($('div.name', row)[1]).text().trim();
      var game = new Game(time, home, away, score);
      games[country][competition].push(game);
    }
  });
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
    console.log('Cache invalidated, running update.');
    var κ = function(data) {
      parseLivescore(data);
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
      var _competition = caseInsensitiveKeySearch(games, country);
      if (_competition !== undefined) {
        callback(games[country][competition]);
      } else {
        callback([]);
      }
    } else {
      callback([]);
    }
  };
  update(success, failure);
};
