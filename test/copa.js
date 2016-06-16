'use strict';

let copa = require('../plugins/copa.js');
let fakeClient = require('./fakeClient.js').fakeClient;

copa.activateOn(fakeClient);
fakeClient.triggerMessage('', '', '!euro QF');
fakeClient.triggerMessage('', '', '!euro sF');
fakeClient.triggerMessage('', '', '!euro F');
