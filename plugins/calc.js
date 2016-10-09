/**
 * Math plugin
 * @module plugins/calc
 */
'use strict';

var math = require('mathjs');

const trigger = /^!calc /i;

const shortcuts = [
  {
    trigger: /^!c ([0-9.]+)f?$/i,
    evalString: ' degF in degC'
  },
  {
    trigger: /^!f ([0-9.]+)c?$/i,
    evalString: ' degC in degF'
  },
  {
    trigger: /^!km ([0-9.]+)(?:mi)?$/i,
    evalString: ' mile in kilometer'
  },
  {
    trigger: /^!mi(?:le)? ([0-9.]+)(?:km)?$/i,
    evalString: ' kilometer in mile'
  },
  {
    trigger: /^!kg ([0-9.]+)(?:lbs)?$/i,
    evalString: ' lbs in kilogram'
  },
  {
    trigger: /^!lbs ([0-9.]+)(?:kg)?$/i,
    evalString: ' kilogram in lbs'
  }
];

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

    // Shortcuts
    for (let i = 0; i < shortcuts.length; i++) {
      let m = text.match(shortcuts[i].trigger);
      if (m !== null) {
        let expr = m[1];
        try {
          let ans = math.eval(m[1] + shortcuts[i].evalString);
          client.say(to, math.format(ans));
        } catch(e) {
          console.error(e);
          client.say(to, 'Sorry, that was a bit too hard for me.');
        }
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
