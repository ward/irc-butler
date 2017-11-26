'use strict';

let twitter = require('../plugins/twitter.js');
let fakeClient = require('./fakeClient.js').fakeClient;

twitter.activateOn(fakeClient);

fakeClient.triggerMessage('', '', 'https://twitter.com/wardmuylaert/status/752503004675313664');
fakeClient.triggerMessage('', '', 'sdflh https://twitter.com/wardmuylaert/status/752503004675313664 sueoyewq');
fakeClient.triggerMessage('', '', 'https://twitter.com/Tomvanasbroeck/status/773830049179009024');
fakeClient.triggerMessage('', '', 'https://twitter.com/BelRedDevils/status/928960200098418688');
