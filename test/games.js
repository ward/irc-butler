'use strict';

let football = require('../plugins/football.js');
let fakeClient = require('./fakeClient.js').fakeClient;

football.activateOn(fakeClient);

fakeClient.triggerMessage('', '', '!games');
fakeClient.triggerMessage('', '', '!games England');
fakeClient.triggerMessage('', '', '!games Liga');
fakeClient.triggerMessage('', '', '!games wwc');
