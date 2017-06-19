let fakeClient = require('./fakeClient.js').fakeClient;
let plugins = require('../plugins.js');

plugins.enablePlugins(fakeClient);

// Fake plugin with no info
let noInfoPlugin = {
};
fakeClient.plugins.add(noInfoPlugin);

// Make a fake plugin which fails from lacking info
let wrongInfoPlugin = {
  'info': {
    'id': 'fakePlugin'
  }
};

fakeClient.plugins.add(wrongInfoPlugin);

let noActivateOnPlugin = {
  'info': {
    'id': 'fakePlugin',
    'version': '0.0.1',
    'description': 'Blab'
  }
};

fakeClient.plugins.add(noActivateOnPlugin);

let failingActivateOnPlugin = {
  'activateOn': function(client) {
    throw new Error('I cannot activate!');
  },
  'info': {
    'id': 'fakePlugin',
    'version': '0.0.1',
    'description': 'Blab'
  }
};

fakeClient.plugins.add(failingActivateOnPlugin);

if (fakeClient.plugins.plugins.length === 0) {
  console.log('toppie');
} else {
  console.log('something is wrong');
}
