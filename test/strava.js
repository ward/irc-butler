'use strict';

let strava = require('../plugins/strava.js');
let fakeClient = require('./fakeClient.js').fakeClient;

strava.activateOn(fakeClient);

//fakeClient.triggerMessage('', '', 'https://www.strava.com/athletes/1091838');
//fakeClient.triggerMessage('', '', 'https://www.strava.com/athletes/2232601');

//strava.getClubLeaderboard('freenode_running');
fakeClient.triggerMessage('','', 'https://www.strava.com/clubs/freenode_running');
