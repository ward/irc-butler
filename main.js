var irc = require('irc');

var plugins = require('./plugins.js');

// Plugins
const football = require('./plugins/football.js');
const calc = require('./plugins/calc.js');

/* Start the connection. */
var client = new irc.Client('irc.freenode.net', 'irc-butler', {
  channels: ['#irc-butler'],
  debug: true,
  encoding: 'utf-8',
  floodProtection: true,
  userName: 'butler',
  realName: 'Your butler for a nice IRC experience',
  stripColors: true,
});

client.addListener('message#', function(nick, to, text, message) {
  console.log(nick, to, text);
});

plugins.enablePlugins(client);

client.plugins.add(football);
client.plugins.add(calc);
