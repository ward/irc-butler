/**
 * Retake Name plugin
 * @module plugins/retake-name
 */
'use strict';

let config = require('config');
const nick = config.get('irc.nick');

// Configure this plugin to check every CHECK_EVERY seconds
const CHECK_EVERY = 10 * 60 * 1000;

// Keeps track of when we last attempted to retake our nick
let lastnickreclaim = 0;

/**
 * @return boolean True if it is time to reclaim nick
 */
function time_to_check() {
  let currenttime = (new Date()).getTime();
  return (currenttime - lastnickreclaim) > CHECK_EVERY;
}
function check_done() {
  lastnickreclaim = (new Date()).getTime();
}

function is_nickserv(raw_message) {
  return raw_message.nick === 'NickServ' && raw_message.user === 'NickServ' && raw_message.host === 'services.';
}

exports.activateOn = function(client) {
  // Check every message
  client.addListener('message', function(_from, _to, _text) {
    // If we havent recently checked
    if (client.nick !== nick && time_to_check()) {
      check_done();
      // Get rid of this counter if it was set before. Used by the framework
      // (sigh) to add numbers to a taken name.  Issue is that it carries over
      // to a next failure down the line and never resets its number.
      if (typeof(client.opt.nickMod) !== 'undefined') {
        delete client.opt.nickMod;
      }
      client.send('NICK', nick);
    }
  });

  client.addListener('notice', function(nick, to, text, message) {
    if (client.nick === to) {
      if (is_nickserv(message)) {
        if (text.indexOf('This nickname is registered.') > -1) {
          client.send(nick, 'identify ' + config.get('bot.nickserv.password'));
        }
      }
    }
  });
};
exports.info = {
  id: 'retake-name',
  version: '0.0.1',
  description: 'Take name back automatically.',
  commands: []
};
