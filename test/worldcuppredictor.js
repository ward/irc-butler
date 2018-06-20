'use strict';

let fantasypl = require('../plugins/worldcuppredictor.js');
let fakeClient = require('./fakeClient.js').fakeClient;

fantasypl.activateOn(fakeClient);

fakeClient.triggerMessage('', '', '!predict');
fakeClient.triggerMessage('', '', '!tie');
