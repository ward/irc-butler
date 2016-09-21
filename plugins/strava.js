'use strict';

let config = require('config');
let http = require('https');

let request = require('request');

// TODO: config file needs restructuring to allow config for plugins
// this solution is ugly
// TODO: Should also be standardised usage/checks
// TODO: Should failure to load a plugin halt the entire bot?
let stravaconfig = config.get('bot.strava');
for (let key in stravaconfig) {
  if (stravaconfig[key] === null || stravaconfig[key] === undefined) {
    throw new Error('Tried to load strava plugin, but credentials are not present: ' + JSON.stringify(stravaconfig));
  }
}

function getClub(id, success) {
  let url = 'https://www.strava.com/api/v3/clubs/' + id + '?access_token=' + stravaconfig.access_token;
  request(url, function(err, response, body) {
    if (response.statusCode === 200) {
      let club = JSON.parse(body);
      let res = club.name + ', a ';
      res += club.sport_type + ' club with ';
      res += club.member_count + ' members. ';
      success(res);
    }
  });
}

function getClubLeaderboard(id, success) {
  let url = 'https://www.strava.com/clubs/' + id + '/leaderboard';
  request(url, function(err, response, body) {
    let leaderboard = JSON.parse(body).data;
    if (leaderboard.length !== 0) {
      success(
        leaderboard
          .slice(0,5)
          .map((v, idx) => '['+(idx+1)+'] ' + formatClubLeaderboardAthlete(v))
          .join(' '));
    }
  });
}
function formatClubLeaderboardAthlete(a) {
  let res = formatText(a.athlete_firstname + ' ' + a.athlete_lastname, 'bold');
  let km = Math.floor(a.distance / 100) / 10;
  res += ' ' + km + 'km (↑' + Math.round(a.elev_gain) + 'm) in ';
  res += formatTime(a.moving_time) + ' (' + formatTime(a.moving_time / (a.distance / 1000)) + '/km)';
  return res;
}
function formatTime(secs) {
  let s = Math.floor(secs);
  let hours = Math.floor(s / 3600);
  let minutes = Math.floor((s % 3600) / 60);
  let seconds = s % 60;
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  if (hours === 0) {
    return minutes + ':' + seconds;
  } else {
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return hours + ':' + minutes + ':' + seconds;
  }
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

const clubRegex = /https?:\/\/www\.strava\.com\/clubs\/(\w+)/;
const athleteRegex = /https?:\/\/www\.strava\.com\/athletes\/(\d+)/;

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let clubid = text.match(clubRegex);
    if (clubid !== null) {
      let success = function(result) {
        client.say(to, '[STRAVA]' + ' ' + result);
        let success = function(result) {
          client.say(to, '[STRAVA]' + ' ' + result);
        };
        getClubLeaderboard(clubid[1], success);
      };
      getClub(clubid[1], success);
    }
  });
};
exports.info = {
  id: 'strava',
  version: '0.0.1',
  description: 'Gets information about a strava link',
  commands: []
};
