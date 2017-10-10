'use strict';

let p = require('../plugins/soccerway-plug.js');
let fakeClient = require('./fakeClient.js').fakeClient;
p.activateOn(fakeClient);

fakeClient.triggerMessage('', '', '!stand cl d');
fakeClient.triggerMessage('', '', '!stand el k');
fakeClient.triggerMessage('', '', '!rank conmebol');
