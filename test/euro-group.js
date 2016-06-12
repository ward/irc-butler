'use strict';

let euro = require('../plugins/euro.js');
let fakeClient = require('./fakeClient.js').fakeClient;

euro.activateOn(fakeClient);
//fakeClient.triggerMessage('', '', '!euro A');
//fakeClient.triggerMessage('', '', '!euro b');
//fakeClient.triggerMessage('', '', '!euro C');
//fakeClient.triggerMessage('', '', '!euro D');
//fakeClient.triggerMessage('', '', '!euro bel');
//fakeClient.triggerMessage('', '', '!euro POR');
fakeClient.triggerMessage('', '', '!euro 3');
