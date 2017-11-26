'use strict';

let config = require('config');

let Twitter = require('twitter');
let he = require('he');

let twitterconfig = config.get('bot.twitter');
let twitter = null;

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
    twitter.get('statuses/show', {'id': tweetid})
      .then(function(tweet) {
        let date = new Date(tweet.created_at);
        date = date.toISOString().slice(0, 10);
        let text = tweet.text.replace(/\n|\r/g, ' ');
        text = he.decode(text);
        client.say(to, '[TWITTER] @' + tweet.user.screen_name + ': ' + text + ' (' + date + ')');
      })
      .catch(function(err) {
        console.error('Failed to get tweet info');
        console.error(err);
      });
  });
};
exports.info = {
  id: 'twitter',
  version: '0.1.0',
  description: 'Gets information about a tweet link',
  commands: []
};
