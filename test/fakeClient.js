'use strict';

let fakeClient = {
  listeners: {},
  addListener: function(where, what) {
    fakeClient.listeners[where] = what;
  },
  triggerMessage: function(from, to, text) {
    fakeClient.listeners['message#'](from, to, text);
  },
  say: function(ignore, output) {
    console.log(output);
  }
};

exports.fakeClient = fakeClient;
