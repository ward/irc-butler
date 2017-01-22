/**
 * Soccerway utility functions
 * @module plugins/soccerway
 */
'use strict';

const $ = require('cheerio');
const request = require('request');

const CACHE_DURATION = 60 * 1000;

let urls = {
  'A': 'http://int.soccerway.com/international/africa/africa-cup-of-nations/2017-gabon/group-stage/group-a/g10424/',
  'B': 'http://int.soccerway.com/international/africa/africa-cup-of-nations/2017-gabon/group-stage/group-b/g10425/',
  'C': 'http://int.soccerway.com/international/africa/africa-cup-of-nations/2017-gabon/group-stage/group-c/g10426/',
  'D': 'http://int.soccerway.com/international/africa/africa-cup-of-nations/2017-gabon/group-stage/group-d/g10427/',
  'stages': 'http://int.soccerway.com/international/africa/africa-cup-of-nations/2017-gabon/s11664/final-stages/',
};
/**
 * Turns a group name (a letter) into a soccerway URL
 */
function groupToUrl(letter) {
  for (let key in urls) {
    if (key === letter) {
      return urls[key];
    }
  }
}

let data = {
  'groups': {},
  'stages': {},
};

// Parse functions {{{
/**
 * Called with the html source of a group's page. Returns group standings and games.
 */
function parseGroupPage(data) {
  let loaded = $.load(data);

  let rows = loaded('table.leaguetable.sortable.table.detailed-table tbody tr');
  let rank = [];
  rows.each(function() {
    let row = $(this);
    rank.push(parseGroupEntry(row));
  });

  rows = loaded('table.matches tbody tr');
  let games = [];
  rows.each(function() {
    let row = $(this);
    games.push(parseGame(row));
  });

  return {ranks: rank, games: games};
}
/**
 * Called with a html table row (tr) representing one entry in a group's standings.
 */
function parseGroupEntry(row) {
  let cells = $('td', row);
  let res = {
    rank: $(cells[0]).text(),
    team: $(cells[2]).text(),
    played: $(cells[3]).text(),
    win: $(cells[4]).text(),
    draw: $(cells[5]).text(),
    lose: $(cells[6]).text(),
    gf: $(cells[7]).text(),
    ga: $(cells[8]).text(),
    gd: parseInt($(cells[9]).text()),
    points: $(cells[10]).text()
  };
  return res;
}
/**
 * Called with a html table row (tr) representing one game.
 */
function parseGame(row) {
  let cells = $('td', row);
  // There can be additions, but they are there on both sides, hidden by styling...
  // So remove those not visible and get it over with
  $(cells[3]).find('span.score-addition').not('.addition-visible').remove();
  let cleanscore = $(cells[3]).text().trim().replace(/ |\n/g, '');

  // Hack to get the hour right (it returns in timezone of originating IP)
  // For central europe: requires -1 in winter, -2 in summer
  if (cleanscore.indexOf(':') > -1) {
    let hour = parseInt(cleanscore.substring(0,2));
    hour = hour - 1;
    cleanscore = hour + cleanscore.substring(2);
  }
  let res = {
    date: $(cells[1]).text().trim().replace('/16', ''),
    home: $(cells[2]).text().trim(),
    score: cleanscore,
    away: $(cells[4]).text().trim()
  };
  return res;
}
/**
 * Called with the html source of a knockout round stages. Returns games.
 */
function parseStages(data) {
  let loaded = $.load(data);

  let tables = loaded('table.matches tbody');
  let games = [];
  tables.each(function() {
    let table = $(this);
    let rows = $('tr', table);
    rows.each(function() {
      let row = $(this);
      games.push(parseGame(row));
    });
  });
  return games;
}
// }}}

// Syncing functions {{{
/**
 * Check if the object of interest needs a sync before being usable.
 * Parameter is 'stages' or group letter
 */
function needToSync(what) {
  if (what === 'stages') {
    return data.stages.lastUpdate === undefined ||
           (new Date() - data.stages.lastUpdate) > CACHE_DURATION;
  } else {
    return data.groups[what] === undefined ||
           data.groups[what].lastUpdate === undefined ||
           (new Date() - data.groups[what].lastUpdate) > CACHE_DURATION;
  }
}
/**
 * Sync a group
 */
function syncGroup(letter, κ, φ) {
  let url = groupToUrl(letter);
  request(url, function(err, resp, body) {
    if (err === null && resp.statusCode === 200) {
      let res = parseGroupPage(body);
      // Cache it
      data.groups[letter] = res;
      data.groups[letter].lastUpdate = new Date();
      κ();
    } else {
      φ(err);
    }
  });
}
/**
 * Sync the stages
 */
function syncStages(κ, φ) {
  let url = urls.stages;
  console.log(url);
  request(url, function(err, resp, body) {
    if (err === null && resp.statusCode === 200) {
      let res = parseStages(body);
      data.stages = res;
      data.stages.lastUpdate = new Date();
      κ();
    } else {
      φ(err);
    }
  });
}
/**
 * Sync if needed
 */
function syncIfNeeded(what, κ, φ) {
  if (what === 'stages' && needToSync(what)) {
    syncStages(κ, φ);
  } else if (needToSync(what)) {
    syncGroup(what, κ, φ);
  } else {
    κ();
  }
}
// }}}

// Get info {{{
/**
 * Takes a letter and returns the rankings and games for the group.
 */
function getGroup(letter) {
  if (letter in data.groups) {
    return data.groups[letter];
  }
  return undefined; // Is this a good thing to return here?
}
/**
 * Returns all the stages, picking what you want has to be done by the
 * receiver.  Done this way since it depends on the competition what games are
 * being played.
 */
function getStages() {
  return data.stages;
}
// }}}

// Configuration functions {{{
function setStagesURL(url) {
  urls.stages = url;
}
function setGroupURL(group, url) {
  urls[group] = url;
}
// }}}

exports.syncIfNeeded = syncIfNeeded;
exports.getGroup = getGroup;
exports.getStages = getStages;
exports.setStagesURL = setStagesURL;
exports.setGroupURL = setGroupURL;
