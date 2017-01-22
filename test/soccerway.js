const soccerway = require('../plugins/soccerway.js');

soccerway.syncIfNeeded('B', function() {
  console.log(soccerway.getGroup('B'));
});

console.log(soccerway.getGroup('A'));
