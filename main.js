var util = require('util');
var irc = require('irc');
var config = require('config');

var plugins = require('./plugins.js');

// Plugins
const football = require('./plugins/football.js');
const calc = require('./plugins/calc.js');

/* Start the connection. */
var client = new irc.Client(
  config.get('irc.network'),
  config.get('irc.nick'),
  {
    channels: config.get('irc.channels'),
    debug: true,
    encoding: 'utf-8',
    floodProtection: true,
    userName: config.get('irc.userName'),
    realName: config.get('irc.realName'),
    stripColors: true
  }
);

client.addListener('message#', function(nick, to, text, _raw) {
  util.log(nick, to, text);
});

plugins.enablePlugins(client);

client.plugins.add(football);
client.plugins.add(calc);
