'use strict';

let config = require('config');
let request = require('request');

let utils = require('../utils.js');

let stravaconfig = config.get('bot.strava');
for (let key in stravaconfig) {
  if (stravaconfig[key] === null || stravaconfig[key] === undefined) {
    throw new Error('Tried to load strava plugin, but credentials are not present: ' + JSON.stringify(stravaconfig));
  }
}

function getClub(id, success) {
  let url = 'https://www.strava.com/api/v3/clubs/' + id + '?access_token=' + stravaconfig.access_token;
  request(url, function(err, response, body) {
    if (err === null && response.statusCode === 200) {
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
    if (err === null && response.statusCode === 200) {
      let leaderboard = JSON.parse(body).data;
      if (leaderboard.length !== 0) {
        success(
          leaderboard
            .slice(0,5)
            .map((v, idx) => '['+(idx+1)+'] ' + formatClubLeaderboardAthlete(v))
            .join(' '));
      }
    }
  });
}
function formatClubLeaderboardAthlete(a) {
  let res = utils.formatText(a.athlete_firstname + ' ' + a.athlete_lastname, 'bold');
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

const clubRegex = /https?:\/\/www\.strava\.com\/clubs\/(\w+)/;
//const athleteRegex = /https?:\/\/www\.strava\.com\/athletes\/(\d+)/;

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let sayClub = function(result) {
      client.say(to, '[STRAVA]' + ' ' + result);
      let success = function(result) {
        client.say(to, '[STRAVA]' + ' ' + result);
      };
      getClubLeaderboard(clubid[1], success);
    };
    if (text.match(/^!strava/)) {
      client.say(to, 'Freenode\'s Strava running club: https://www.strava.com/clubs/freenode_running');
      getClub('freenode_running', sayClub);
    }
    let clubid = text.match(clubRegex);
    if (clubid !== null) {
      getClub(clubid[1], sayClub);
    }
  });
};
exports.info = {
  id: 'strava',
  version: '0.0.1',
  description: 'Gets information about a strava link',
  commands: []
};
