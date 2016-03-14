/**
 * Math plugin
 * @module plugins/calc
 */
'use strict';

var math = require('mathjs');

const trigger = /^!calc /i;

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    if (text.search(trigger) > -1) {
      var expr = text.substring(6);
      try {
        var ans = math.eval(expr);
        client.say(to, math.format(ans));
      } catch (e) {
        console.error(e);
        client.say(to, 'Sorry, that was a bit too hard for me.');
      }
    }
  });
};
exports.info = {
  id: 'calc',
  version: '0.0.1',
  description: 'Calculator to handle your mathematical problems.',
  commands: [
    {
      trigger: '!calc QUERY',
      description: 'Performs the query and returns the result. ' +
                    'Notifies you if this fails.'
    }
  ]
};
