/**
 * CL, EL
 */

const Soccerway = require('./soccerway.js').Soccerway;

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

const groupMatcher = /^!stand(?:ings?)? u?cl ([A-H])$/i;

function oneTeamToString(team) {
  let result =
    team.rank +
    '. ' +
    team.team.toUpperCase() +
    ' ' +
    team.points +
    'pts ' +
    team.win + '-' + team.draw + '-' + team.lose +
    ' ' +
    team.gf + '-' + team.ga;
  return result;
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let trimmedText = text.trim();
    let groupMatch = trimmedText.match(groupMatcher);
    if (groupMatch !== null) {
      let group = groupMatch[1].toUpperCase();
      cl.syncIfNeeded(group, function() {
        let res = cl.getGroup(group);
        res = res.ranks.map(oneTeamToString).join('; '));
        client.say(to, '[GROUP ' + group + '] ' + res);
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

