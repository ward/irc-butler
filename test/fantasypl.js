'use strict';

let fantasypl = require('../plugins/fantasypl.js');
let fakeClient = require('./fakeClient.js').fakeClient;

fantasypl.activateOn(fakeClient);

fakeClient.triggerMessage('', '', '!fpl');
