var irc = require('irc');

// Plugins
const football = require('./footballplugin.js');
const math = require('./mathplugin.js');

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

client.addListener('message#', function(nick, to, text, message) {
  console.log(nick, to, text);
});

football.activateOn(client);
math.activateOn(client);
