'use strict';
const soccerway = require('../plugins/soccerway.js');

let urls = {
  'A': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-a/g11480/',
  'B': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-b/g11481/'
}
let cl = new soccerway.Soccerway(urls);

cl.syncIfNeeded('B', function() {
  console.log(cl.getGroup('B'));
});

console.log(cl.getGroup('A'));
