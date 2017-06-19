'use strict';

let strava = require('../plugins/strava.js');
let fakeClient = require('./fakeClient.js').fakeClient;

strava.activateOn(fakeClient);

//fakeClient.triggerMessage('', '', 'https://www.strava.com/athletes/1091838');
//fakeClient.triggerMessage('', '', 'https://www.strava.com/athletes/2232601');

//fakeClient.triggerMessage('','', 'https://www.strava.com/clubs/freenode_running');
//fakeClient.triggerMessage('', '', 'https://www.strava.com/clubs/sqwheodabvlbcsdf');
//fakeClient.triggerMessage('','','https://www.strava.com/clubs/CenturianRunners');
//fakeClient.triggerMessage('','','!strava');

//fakeClient.triggerMessage('','','https://www.strava.com/activities/810654646');
//fakeClient.triggerMessage('','','https://www.strava.com/activities/812589430/overview');
//fakeClient.triggerMessage('', '', 'https://www.strava.com/segments/13116188');
//strava.xx(13116188)
//strava.xx(229781)
