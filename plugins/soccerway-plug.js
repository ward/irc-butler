/**
 * CL, EL
 */

// TODO: Expand to regular leagues
// 14:19 <Vaanir> Top 6 teams maybe ward
// 14:22 <ward> was thinking along those lines, just wondering about situation where you *do* care about the lower spots
// 14:23 <ward> maybe also something along the lines of !rank epl TEAMNAME that shows the spots surrounding that team
// 14:23 <ward> or the actual rank number I guess in addition to teamname
// 14:24 <ward> and default to top 6, that sounds okish
// 14:24 <ward> will have to see how it looks later

const Soccerway = require('./soccerway.js').Soccerway;

function oneTeamToString(team) {
  let result =
    team.rank +
    '. ' +
    team.team +
    ' ' +
    team.points +
    'pts ' +
    team.win + '-' + team.draw + '-' + team.lose +
    ' ' +
    team.gf + '-' + team.ga;
  return result;
}

const cl = new Soccerway({
  'A': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-a/g11480/',
  'B': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-b/g11481/',
  'C': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-c/g11482/',
  'D': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-d/g11483/',
  'E': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-e/g11484/',
  'F': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-f/g11485/',
  'G': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-f/g11485/',
  'H': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-h/g11487/',
  'stages': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/s14294/final-stages/'
});

const clGroupMatcher = /^!(?:rank|stand)(?:ings?)? u?cl ([A-H])$/i;

const el = new Soccerway({
  'A': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-a/g11411/',
  'B': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-b/g11412/',
  'C': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-c/g11413/',
  'D': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-d/g11414/',
  'E': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-e/g11415/',
  'F': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-f/g11416/',
  'G': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-g/g11417/',
  'H': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-h/g11418/',
  'I': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-i/g11419/',
  'J': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-j/g11420/',
  'K': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-k/g11421/',
  'L': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/group-stage/group-l/g11422/',
  'stages': 'http://int.soccerway.com/international/europe/uefa-cup/20172018/s14115/final-stages/'
});

const elGroupMatcher = /^!(?:rank|stand)(?:ings?)? el ([A-L])$/i;

const uefa = new Soccerway({
  'A': 'http://int.soccerway.com/international/europe/wc-qualifying-europe/2018-russia/1st-round/group-a/g8854/',
  'B': 'http://int.soccerway.com/international/europe/wc-qualifying-europe/2018-russia/1st-round/group-b/g8855/',
  'C': 'http://int.soccerway.com/international/europe/wc-qualifying-europe/2018-russia/1st-round/group-c/g8856/',
  'D': 'http://int.soccerway.com/international/europe/wc-qualifying-europe/2018-russia/1st-round/group-d/g8857/',
  'E': 'http://int.soccerway.com/international/europe/wc-qualifying-europe/2018-russia/1st-round/group-e/g8858/',
  'F': 'http://int.soccerway.com/international/europe/wc-qualifying-europe/2018-russia/1st-round/group-f/g8859/',
  'G': 'http://int.soccerway.com/international/europe/wc-qualifying-europe/2018-russia/1st-round/group-g/g8860/',
  'H': 'http://int.soccerway.com/international/europe/wc-qualifying-europe/2018-russia/1st-round/group-h/g8861/',
  'I': 'http://int.soccerway.com/international/europe/wc-qualifying-europe/2018-russia/1st-round/group-i/g8862/',
});

const uefaGroupMatcher = /^!(?:rank|stand)(?:ings?)? uefa ([A-I])$/i;

const conmebol = new Soccerway({
  'main': 'http://int.soccerway.com/international/south-america/wc-qualifying-south-america/2018-russia/1st-round/r31495/'
});

const conmebolGroupMatcher = /^!(?:rank|stand)(?:ings?)? conmebol$/i;

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let trimmedText = text.trim();
    let clGroupMatch = trimmedText.match(clGroupMatcher);
    let elGroupMatch = trimmedText.match(elGroupMatcher);
    let uefaGroupMatch = trimmedText.match(uefaGroupMatcher);
    let conmebolGroupMatch = trimmedText.match(conmebolGroupMatcher);
    if (clGroupMatch !== null) {
      let group = clGroupMatch[1].toUpperCase();
      cl.syncIfNeeded(group, function() {
        let res = cl.getGroup(group);
        res = res.ranks.map(oneTeamToString).join('; ');
        client.say(to, '[GROUP ' + group + '] ' + res);
      });
    } else if (elGroupMatch !== null) {
      let group = elGroupMatch[1].toUpperCase();
      el.syncIfNeeded(group, function() {
        let res = el.getGroup(group);
        res = res.ranks.map(oneTeamToString).join('; ');
        client.say(to, '[GROUP ' + group + '] ' + res);
      });
    } else if (uefaGroupMatch !== null) {
      let group = uefaGroupMatch[1].toUpperCase();
      uefa.syncIfNeeded(group, function() {
        let res = uefa.getGroup(group);
        res = res.ranks.map(oneTeamToString).join('; ');
        client.say(to, '[GROUP ' + group + '] ' + res);
      });
    } else if (conmebolGroupMatch !== null) {
      conmebol.syncIfNeeded('main', function() {
        let res = conmebol.getGroup('main');
        res = res.ranks.map(oneTeamToString).join('; ');
        client.say(to, '[CONMEBOL] ' + res);
      });
    }
  });
};
exports.info = {
  id: 'clel',
  version: '0.0.1',
  description: 'CL and EL info',
  commands: [
    {
      trigger: '!stand(ings) CL/EL GROUPLETTER',
      description: 'Show standings for GROUP'
    },
  ]
};
