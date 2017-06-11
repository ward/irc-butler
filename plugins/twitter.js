'use strict';

let config = require('config');

let Twitter = require('twitter-node-client').Twitter;

let twitterconfig = config.get('bot.twitter');
let twitter = null;

// Now just use
// twitter.getTweet({ id: '1111111111'}, error, success);
// For details see https://dev.twitter.com/rest/reference/get/statuses/show/%3Aid

const tweetRegex = /https?:\/\/twitter\.com\/(\S+?)\/status\/(\d+)/;
function matchTweet(text) {
  let m = text.match(tweetRegex);
  if (m === null) {
    return null;
  } else {
    return m[2];
  }
}

exports.activateOn = function(client) {
  for (let key in twitterconfig) {
    if (twitterconfig[key] === null || twitterconfig[key] === undefined) {
      throw new Error('Tried to load twitter plugin, but credentials are not present: ' + JSON.stringify(twitterconfig));
    }
  }
  twitter = new Twitter(twitterconfig);

  client.addListener('message#', function(from, to, text) {
    let tweetid = matchTweet(text);
    if (tweetid === null) {
      return;
    }
    let fail = function(err, response, body) {
      console.error('Failed to get tweet info');
      console.error(err);
      console.error(response);
      console.error(body);
    };
    let success = function(rawdata) {
      let data = JSON.parse(rawdata);
      client.say(to, '[TWITTER] @' + data.user.screen_name + ': ' + data.text.replace(/\n|\r/g, ' '));
    };
    twitter.getTweet({ id: tweetid }, fail, success);
  });
};
exports.info = {
  id: 'twitter',
  version: '0.0.1',
  description: 'Gets information about a tweet link',
  commands: []
};
