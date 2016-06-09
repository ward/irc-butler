'use strict';

let euro = require('../plugins/euro.js');
let fakeClient = require('./fakeClient.js').fakeClient;

euro.activateOn(fakeClient);
fakeClient.triggerMessage('', '', '!euro E');
