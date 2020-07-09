/**
 * Alias plugin
 * @module plugins/alias
 */
'use strict';

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text, message) {
    let trimmedText = text.trim();
    if (trimmedText === '!epl') {
      client.emit('message#', from, to, '!games epl', message);
    }
  });
};
exports.info = {
  id: 'alias',
  version: '0.0.1',
  description: 'Some aliases to often used commands.',
  commands: []
};
