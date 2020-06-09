var util = require('util');
var irc = require('irc-upd');
var config = require('config');

var plugins = require('./plugins.js');

// Plugins
const pluginlist = config.get('bot.plugins');
for (var i = 0; i < pluginlist.length; i++) {
  pluginlist[i] = require('./plugins/' + pluginlist[i] + '.js');
}

/* Start the connection. */
var client = new irc.Client(
  config.get('irc.network'),
  config.get('irc.nick'),
  {
    channels: config.get('irc.channels'),
    debug: config.get('debug'),
    encoding: 'utf-8',
    floodProtection: true,
    userName: config.get('irc.userName'),
    realName: config.get('irc.realName'),
    stripColors: true
  }
);

client.addListener('message#', function(nick, to, text, _raw) {
  if (process.env.NODE_ENV !== 'production') {
    util.log(nick, to, text);
  }
});

plugins.enablePlugins(client);

for (var j = 0; j < pluginlist.length; j++) {
  client.plugins.add(pluginlist[j]);
}
