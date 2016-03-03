/**
 * Math plugin
 * @module mathplugin
 */
'use strict';

var math = require('mathjs');

// TODO: Safety of user input https://github.com/josdejong/mathjs/issues/469

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    if (text.startsWith('!calc')) {
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
