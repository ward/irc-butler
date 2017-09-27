/**
 * Soccerway utility functions
 * @module plugins/soccerway
 */
'use strict';

const $ = require('cheerio');
const request = require('request');

const CACHE_DURATION = 60 * 1000;

class Soccerway {
  constructor(urls) {
    // Format: {'A': url, 'B': url, ..., 'stages': url}
    this.urls = urls;
    this.data = {
      'groups': {},
      'stages': {},
    };
  }

  /**
   * Turns a group name (a letter) into a soccerway URL
   */
  groupToUrl(letter) {
    for (let key in this.urls) {
      if (key === letter) {
        return this.urls[key];
      }
    }
  }

  // Syncing functions {{{
  /**
   * Check if the object of interest needs a sync before being usable.
   * Parameter is 'stages' or group letter
   */
  needToSync(what) {
    if (what === 'stages') {
      return this.data.stages.lastUpdate === undefined ||
             (new Date() - this.data.stages.lastUpdate) > CACHE_DURATION;
    } else {
      return this.data.groups[what] === undefined ||
             this.data.groups[what].lastUpdate === undefined ||
             (new Date() - this.data.groups[what].lastUpdate) > CACHE_DURATION;
    }
  }
  /**
   * Sync a group
   */
  syncGroup(letter, κ, φ) {
    let url = this.groupToUrl(letter);
    let self = this;
    request(url, function(err, resp, body) {
      if (err === null && resp.statusCode === 200) {
        let res = self.parseGroupPage(body);
        // Cache it
        self.data.groups[letter] = res;
        self.data.groups[letter].lastUpdate = new Date();
        κ();
      } else {
        φ(err);
      }
    });
  }
  /**
   * Sync the stages
   */
  syncStages(κ, φ) {
    let url = this.urls.stages;
    let self = this;
    request(url, function(err, resp, body) {
      if (err === null && resp.statusCode === 200) {
        let res = self.parseStages(body);
        self.data.stages = res;
        self.data.stages.lastUpdate = new Date();
        κ();
      } else {
        φ(err);
      }
    });
  }
  /**
   * Sync if needed
   */
  syncIfNeeded(what, κ, φ) {
    if (what === 'stages' && this.needToSync(what)) {
      this.syncStages(κ, φ);
    } else if (this.needToSync(what)) {
      this.syncGroup(what, κ, φ);
    } else {
      κ();
    }
  }
  // }}}


  // Parse functions {{{
  /**
   * Called with the html source of a group's page. Returns group standings and games.
   */
  parseGroupPage(data) {
    let self = this;
    let loaded = $.load(data);

    let rows = loaded('table.leaguetable.sortable.table.detailed-table tbody tr');
    let rank = [];
    rows.each(function() {
      let row = $(this);
      rank.push(self.parseGroupEntry(row));
    });

    rows = loaded('table.matches tbody tr');
    let games = [];
    rows.each(function() {
      let row = $(this);
      games.push(self.parseGame(row));
    });

    return {ranks: rank, games: games};
  }
  /**
   * Called with a html table row (tr) representing one entry in a group's standings.
   */
  parseGroupEntry(row) {
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
  parseGame(row) {
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
  parseStages(data) {
    let loaded = $.load(data);

    let tables = loaded('table.matches tbody');
    let games = [];
    tables.each(function() {
      let table = $(this);
      let rows = $('tr', table);
      rows.each(function() {
        let row = $(this);
        games.push(this.parseGame(row));
      });
    });
    return games;
  }
  // }}}

  // Get info {{{
  /**
   * Takes a letter and returns the rankings and games for the group.
   */
  getGroup(letter) {
    if (letter in this.data.groups) {
      return this.data.groups[letter];
    }
    return undefined; // Is this a good thing to return here?
  }
  /**
   * Returns all the stages, picking what you want has to be done by the
   * receiver.  Done this way since it depends on the competition what games are
   * being played.
   */
  getStages() {
    return this.data.stages;
  }
  // }}}

  // Configuration functions {{{
  setStagesURL(url) {
    this.urls.stages = url;
  }
  setGroupURL(group, url) {
    this.urls[group] = url;
  }
  // }}}
}

exports.Soccerway = Soccerway;
