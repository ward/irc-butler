'use strict';

let elo = require('../plugins/elo.js');
let fakeClient = require('./fakeClient.js').fakeClient;

elo.activateOn(fakeClient);

fakeClient.triggerMessage('','','!elo Anderlecht');
fakeClient.triggerMessage('','','!elo paris');
fakeClient.triggerMessage('','','!elo e');
fakeClient.triggerMessage('','','!elo 15');
