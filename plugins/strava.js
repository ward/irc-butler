/**
 * Strava plugin
 * @module plugins/strava
 */
'use strict';

const config = require('config');
const request = require('request');
const ircColors = require('irc-colors');

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
      res += club.member_count + ' members.';
      success(res);
    }
  });
}

function getClubLeaderboard(id, success) {
  let url = 'https://www.strava.com/clubs/' + id + '/leaderboard';
  let options = {
    url: url,
    headers: {
      'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
    }
  };
  request(options, function(err, response, body) {
    if (err === null && response.statusCode === 200) {
      let leaderboard;
      try {
        leaderboard = JSON.parse(body).data;
      } catch(e) {
        console.warn(e);
        return;
      }
      if (leaderboard.length !== 0) {
        success(
          leaderboard
            .slice(0,10)
            .map((v, idx) => ''+(idx+1)+'. ' + formatClubLeaderboardAthlete(v))
            .join(' '));
      }
    }
  });
}
function formatClubLeaderboardAthlete(a) {
  let res = ircColors.bold(a.athlete_firstname);
  let km = Math.round(metretokilometre(a.distance));
  res += ' ' + km + 'k in ';
  res += formatTotalTime(a.moving_time);
  res += ' (' + formatTime(a.moving_time / (a.distance / 1000)) + '/k ↑' + Math.round(a.elev_gain) + 'm)';
  return res;
}
function formatTotalTime(secs) {
  let s = Math.floor(secs);
  let hours = Math.floor(s / 3600);
  let minutes = Math.floor((s % 3600) / 60);
  let seconds = s % 60;
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  return hours + 'h' + minutes;
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

function getSegment(id, success) {
  let url = 'https://www.strava.com/api/v3/segments/' + id + '?access_token=' + stravaconfig.access_token;
  request(url, function(err, response, body) {
    if (err === null && response.statusCode === 200) {
      let segment = JSON.parse(body);
      console.log(segment);
      let result = '"' + segment.name + '", ' + segment.activity_type + ' of ';
      result += (Math.floor(segment.distance / 100) / 10) + 'km @ ';
      result += segment.average_grade + '%. ';
      result += segment.effort_count + ' attempts by ' + segment.athlete_count + ' athletes. ';
      result += 'Located in ' + segment.city + ', ' + segment.state + ', ' + segment.country + '.';
      success(result);
    }
  });
}
function getSegmentLeaders(id) {
  let url = 'https://www.strava.com/api/v3/segments/' + id + '/leaderboard?access_token=' + stravaconfig.access_token + '&page=1&per_page=1';
  let murl = url + '&gender=M';
  request(murl, function(err, response, body) {
    if (err === null && response.statusCode === 200) {
      console.log(JSON.parse(body));
    }
  });
}
exports.xx = getSegmentLeaders;

function getActivity(id, success) {
  let url = 'https://www.strava.com/api/v3/activities/' + id + '?access_token=' + stravaconfig.access_token;
  request(url, function(err, response, body) {
    if (err === null && response.statusCode === 200) {
      let activity = JSON.parse(body);
      let result = '"' + activity.name + '", ' + activity.type;
      if (activity.athlete.firstname !== undefined) {
        result += ' by ' + activity.athlete.firstname + ' ' + activity.athlete.lastname + '. ';
      } else {
        result += '. ';
      }
      result += metretokilometre(activity.distance) + ' km ';
      result += '(↑' + Math.round(activity.total_elevation_gain) + 'm) in ';
      result += formatTime(activity.moving_time) + ' (' + formatTime(activity.moving_time / (activity.distance / 1000)) + '/km)';
      success(result);
    }
  });
}

function metretokilometre(metre) {
  return Math.floor(metre / 100) / 10;
}

const clubRegex = /https?:\/\/www\.strava\.com\/clubs\/(\w+)/;
const segmentRegex = /https?:\/\/www\.strava\.com\/segments\/(\d+)/;
//const athleteRegex = /https?:\/\/www\.strava\.com\/athletes\/(\d+)/;
const activityRegex = /https?:\/\/www\.strava\.com\/activities\/(\d+)/;

/**
 * Adds listener to client to:
 *
 * - Show freenode running club on !strava command
 * - Show strava club info when a club's url is linked in chat
 */
exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let sayClub = function(clubid, withlink=false) {
      return function(result) {
        let text = '[STRAVA]' + ' ' + result;
        if (withlink) {
          text += ' https://www.strava.com/clubs/' + clubid;
        }
        client.say(to, text);
        let success = function(result) {
          client.say(to, '[STRAVA]' + ' ' + result);
        };
        getClubLeaderboard(clubid, success);
      };
    };
    if (text.match(/^!strava/i)) {
      getClub('freenode_running', sayClub('freenode_running', true));
    }
    let clubid = text.match(clubRegex);
    if (clubid !== null) {
      getClub(clubid[1], sayClub(clubid[1]));
    }
    let segmentid = text.match(segmentRegex);
    if (segmentid !== null) {
      getSegment(segmentid[1], function(result) {
        client.say(to, '[STRAVA SEGMENT] ' + result);
      });
    }
    let activityid = text.match(activityRegex);
    if (activityid !== null) {
      getActivity(activityid[1], function(result) {
        client.say(to, '[STRAVA ACTIVITY] ' + result);
      });
    }
  });
};
exports.info = {
  id: 'strava',
  version: '0.0.2',
  description: 'Gets information about a strava link',
  commands: []
};
