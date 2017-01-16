'use strict';

let africa = require('../plugins/africa.js');
let fakeClient = require('./fakeClient.js').fakeClient;

africa.activateOn(fakeClient);
fakeClient.triggerMessage('', '', '!africa A');
fakeClient.triggerMessage('', '', '!africa b');
fakeClient.triggerMessage('', '', '!africa C');
fakeClient.triggerMessage('', '', '!africa D');
fakeClient.triggerMessage('', '', '!africa 3');
fakeClient.triggerMessage('', '', '!africa sdilfH');


fakeClient.triggerMessage('', '', '!africa QF');
fakeClient.triggerMessage('', '', '!africa sF');
fakeClient.triggerMessage('', '', '!africa Final');
