/**
 * Extend an IRC client with plugin functionality.
 *
 * Should handle:
 *  * Get a list of loaded plugins
 *  * Load a plugin
 *  * Unload a plugin
 *  * Handle help for a plugin
 *  * Show detailed info for a plugin
 */
'use strict';

function addPlugin(plugin) {
  let client = this.client;
  plugin.activateOn(client);
}

exports.enablePlugins = function(client) {
  client.plugins = {client: client};
  client.plugins.add = addPlugin;
};
