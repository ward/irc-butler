'use strict';

let copa = require('../plugins/copa.js');
let fakeClient = require('./fakeClient.js').fakeClient;

copa.activateOn(fakeClient);
fakeClient.triggerMessage('', '', '!copa QF');
fakeClient.triggerMessage('', '', '!copa sF');
fakeClient.triggerMessage('', '', '!copa F');
fakeClient.triggerMessage('', '', '!copa 3');
