var irc = require('irc');

/* Start the connection. */
var client = new irc.Client('irc.freenode.net', 'irc-butler', {
  channels: ['#irc-butler'],
  debug: true,
  encoding: 'utf-8',
  floodProtection: true,
  userName: 'irc-butler',
  realName: 'irc-butler',
  stripColors: true,
});

/**
 * Say the current time.
 */
function timeReply(nick, to, text, message) {
  if (text === '!time') {
    client.say(to, (new Date()).toUTCString());
  }
}


client.addListener('message', timeReply);


client.addListener('message#', function(nick, to, text, message) {
  console.log(nick, to, text);
});
