'use strict';

let euro = require('../plugins/euro.js');
let fakeClient = require('./fakeClient.js').fakeClient;

euro.activateOn(fakeClient);
fakeClient.triggerMessage('', '', '!euro 8F');
fakeClient.triggerMessage('', '', '!euro QF');
fakeClient.triggerMessage('', '', '!euro sF');
fakeClient.triggerMessage('', '', '!euro F');
