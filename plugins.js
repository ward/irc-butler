/**
 * Extend an IRC client with plugin functionality.
 *
 * Should handle:
 *
 *  * Get a list of loaded plugins
 *  * Load a plugin
 *  * Unload a plugin
 *  * Handle help for a plugin
 *  * Show detailed info for a plugin
 *
 * @module plugins
 */
'use strict';

function addPlugin(plugin) {
  let client = this.client;
  if (typeof(plugin.info) === 'undefined') {
    let errorMsg = 'Plugin does not provide information about itself,' +
                    'missing .info property.' + plugin;
    throw new TypeError(errorMsg);
  }
  this.plugins.push(plugin.info);
  plugin.activateOn(client);
}

/**
 * Adds a listener to the client parameter that handles !help messages.
 */
function enableHelp(client) {
  client.addListener('message#', function(from, to, text) {
    if (text.startsWith('!help')) {
      let query = text.substring(6).split(' ');
      if (query.length === 1 && query[0] === '') {
        let loadedPlugins = this.plugins.plugins
                                .map(function(p) { return p.id; })
                                .join(', ');
        let reply = 'To get help about a plugin, type !help PLUGINNAME. ';
        reply += 'Loaded plugins: ' + loadedPlugins;
        client.say(to, reply);
      } else if (query.length === 1) {
        // Find the plugin
        let plugin = this.plugins.plugins.find(function(ele, idx, _arr) {
          return ele.id === query[0];
        });
        if (plugin === undefined) {
          client.say(to, 'No such plugin: ' + query[0]);
          return;
        }
        let reply = 'Plugin: ' + plugin.id +
                    ' (v' + plugin.version + '); ' +
                    plugin.description +
                    ' Commands: ' + plugin
                                    .commands
                                    .map(function(c) { return c.trigger; })
                                    .join(', ') +
                    '. More info with !help ' + plugin.id + ' NUMBER.';
        client.say(to, reply);
      } else if (query.length === 2) {
        // Find the plugin
        let plugin = this.plugins.plugins.find(function(ele, idx, _arr) {
          return ele.id === query[0];
        });
        if (plugin === undefined) {
          client.say(to, 'No such plugin: ' + query[0]);
          return;
        }
        let idx = parseInt(query[1]);
        if (idx < 1 || idx > plugin.commands.length) {
          client.say(to, 'Incorrect command number for plugin ' +
                         plugin.id + '.');
          return;
        }
        let command = plugin.commands[idx - 1];
        client.say(to, 'Help for ' + command.trigger + ': ' +
                       command.description);
      } else {
        client.say(to, 'Invalid !help command');
      }
    }
  });
}

/**
 * Adds plugin features to an IRC client object. After application, the client
 * supports
 *
 * .plugins.add: Adds a given plugin
 * .plugins.plugins: List of info for loaded plugins
 */
exports.enablePlugins = function(client) {
  // Need a reference to the enclosing one
  client.plugins = {client: client};
  client.plugins.add = addPlugin;
  client.plugins.plugins = [];
  enableHelp(client);
};
