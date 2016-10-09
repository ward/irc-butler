'use strict';

let calc = require('../plugins/calc.js');
let fakeClient = require('./fakeClient.js').fakeClient;

calc.activateOn(fakeClient);

fakeClient.triggerMessage('', '', '!c 80');
fakeClient.triggerMessage('', '', '!c 80f');
fakeClient.triggerMessage('', '', '!c kaka');
fakeClient.triggerMessage('', '', '!c 80.1');
//fakeClient.triggerMessage('', '', '!c 80...1');
fakeClient.triggerMessage('', '', '!f 20');

fakeClient.triggerMessage('', '', '!km 20');
fakeClient.triggerMessage('', '', '!mi 20');
fakeClient.triggerMessage('', '', '!mile 20');

fakeClient.triggerMessage('', '', '!kg 20');
fakeClient.triggerMessage('', '', '!lbs 20');

fakeClient.triggerMessage('', '', '!cm 5\'1"');
fakeClient.triggerMessage('', '', '!cm 5\'1');
fakeClient.triggerMessage('', '', '!cm 5\' 1.25');

fakeClient.triggerMessage('', '', '!ft 155');
