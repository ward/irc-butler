'use strict';

var $ = require('cheerio');
var http = require('http');

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

function fetchLivescore(callback) {
  var livescoreurl = 'http://www.livescore.com/';
  http.get(livescoreurl, function(response) {
    var data = '';
    response.on('data', function(chunk) {
      data += chunk;
    });
    response.on('end', function() {
      callback(data);
    });
  }).on('error', function() {
    throw new Error();
  });
}

function parseLivescore(data) {
  var parsed = $.load(data);
  var divcontent = parsed('div.content');

  var games = {};
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
  console.log(games);
}

exports.get = function() {
  fetchLivescore(parseLivescore);
};
