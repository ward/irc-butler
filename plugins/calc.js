/**
 * Math plugin
 * @module plugins/calc
 */
'use strict';

var math = require('mathjs');

const trigger = /^!calc /i;

const shortcuts = [
  {
    trigger: /^!c +(-?[0-9.]+) *f?$/i,
    evalString: ' degF in degC'
  },
  {
    trigger: /^!f +(-?[0-9.]+) *c?$/i,
    evalString: ' degC in degF'
  },
  {
    trigger: /^!km +([0-9.]+) *(?:mi)?$/i,
    evalString: ' mile in kilometer'
  },
  {
    trigger: /^!mi(?:le)? +([0-9.]+) *(?:km)?$/i,
    evalString: ' kilometer in mile'
  },
  {
    trigger: /^!kg +([0-9.]+) *(?:lbs)?$/i,
    evalString: ' lbs in kilogram'
  },
  {
    trigger: /^!lbs? +([0-9.]+) *(?:kg)?$/i,
    evalString: ' kilogram in lbs'
  }
];

// These require some special work
const shortcutCM = /^!cm +(\d+)' *([0-9.]+)"?$/i;
const shortcutFeetInch = /^!(?:f(?:ee|oo)?t|in(?:ch|ches)?) +([0-9.]+) *(?:cm)?$/i;
const shortcutPace = /^!pace +(.+)$/i;

function seconds_to_string(seconds) {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  s = s < 10 ? "0" + s : s;
  return m + ":" + s;
}

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
      return;
    }

    // Shortcuts
    for (let i = 0; i < shortcuts.length; i++) {
      let m = text.match(shortcuts[i].trigger);
      if (m !== null) {
        try {
          let ans = math.eval(m[1] + shortcuts[i].evalString);
          client.say(to, math.format(ans));
        } catch(e) {
          console.error(e);
        }
        return;
      }
    }

    let m = text.match(shortcutCM);
    if (m !== null) {
      let feet = m[1];
      let inches = m[2];
      try {
        let ans = math.eval('(' + feet + ' foot + ' + inches + ' inches) in centimeter');
        client.say(to, math.format(ans));
      } catch(e) {
        console.error(e);
      }
      return;
    }

    m = text.match(shortcutFeetInch);
    if (m !== null) {
      try {
        let cm = math.unit(m[1], 'cm');
        let inches = math.mod(cm.toNumber('inch'), 12);
        let feet = math.floor(cm.toNumber('foot'));
        let res = feet + ' foot ' + inches + ' inches';
        client.say(to, res);
      } catch(e) {
        console.error(e);
      }
      return;
    }

    m = text.match(shortcutPace);
    if (m !== null) {
      // Analyse what exactly the input is and calc based on that
      m = m[1].match(/^([0-9]+)(?:[m:]([0-9]?[0-9])s?)?$/i);
      if (m !== null) {
        let minutes = parseInt(m[1]);
        let seconds = 0;
        if (m[2] !== undefined) {
          seconds = parseInt(m[2]);
        }
        let basepace = seconds + minutes * 60;
        let pacepermile = Math.round(basepace * 1.6093);
        let paceperkm = Math.round(basepace / 1.6093);
        let miletokmtext = seconds_to_string(basepace) + "/mile = " + seconds_to_string(paceperkm) + "/km";
        let kmtomiletext = seconds_to_string(basepace) + "/km = " + seconds_to_string(pacepermile) + "/mile";
        client.say(to, miletokmtext + " || " + kmtomiletext);
      }
    }
  });
};
exports.info = {
  id: 'calc',
  version: '0.0.4',
  description: 'Calculator to handle your mathematical problems.',
  commands: [
    {
      trigger: '!calc QUERY',
      description: 'Performs the query and returns the result. ' +
                    'Notifies you if this fails.'
    },
    {
      trigger: '!kg/!lbs/!km/!mi/!c/!f NUMBER',
      description: 'Conversions between weight, distance, or temperature.'
    },
    {
      trigger: '!cm NUMBER\'NUMBER"',
      description: 'Convert feet and inch to centimetres.'
    },
    {
      trigger: '!feet/!inch NUMBER',
      description: 'Convert centimetres to feet and inch.'
    },
    {
      trigger: '!pace NUMBER:NUMBER',
      description: 'Convert pace per km to pace per mile (and vice versa)'
    },
  ]
};
