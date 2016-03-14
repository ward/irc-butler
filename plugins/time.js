/**
 * Time plugin
 * @module plugins/time
 */
'use strict';

var textMatcher = /^!(?:time|utc|gmt)$/i;
var gmtMatcher = /^!gmt$/i;

function timeParser(text) {
  let reply = 'It is currently ';
  reply += (new Date()).toUTCString().replace('GMT', 'UTC');
  if (text.search(gmtMatcher) > -1) {
    reply = 'Lol GMT, get with the times, grandpa. ' + reply;
  }
  return reply;
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let trimmedText = text.trim();
    if (trimmedText.search(textMatcher) > -1) {
      client.say(to, timeParser(trimmedText));
    }
  });
};
exports.info = {
  id: 'time',
  version: '0.0.1',
  description: 'Say what time it is.',
  commands: [
    {
      trigger: '!time',
      description: 'Gives current time in UTC.'
    },
    {
      trigger: '!utc',
      description: 'Gives current time in UTC.'
    },
    {
      trigger: '!gmt',
      description: '[DEPRECATED] Gives current time in UTC.'
    }
  ]
};
