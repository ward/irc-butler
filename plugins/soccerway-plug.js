/**
 * CL, EL
 */

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

const clGroupMatcher = /^!(?:rank|stand)(?:ings?)? +u?cl +([A-H])$/i;

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

const elGroupMatcher = /^!(?:rank|stand)(?:ings?)? +el +([A-L])$/i;

const epl = new Soccerway({
  '1': 'http://int.soccerway.com/national/england/premier-league/20172018/regular-season/r41547/',
});
const eplMatcher = /^!(?:rank|stand)(?:ings?)? +epl(?: +(.+))?$/i;

/**
 * who can be:
 * - undefined: first 6 are picked
 * - a (partial) team name: name is matched, position found, function called with position
 * - a number: position to show, 5 surrounding it will also be shown
 */
function decideWhichToShow(ranks, who) {
  if (who === undefined) {
    return ranks.slice(0, 6);
  } else if (typeof who === 'number') {
    // Note that the number given is in a start-at-1 context
    if (ranks.length <= 6) { return ranks; }
    if (who >= ranks.length - 3) { return ranks.slice(-6); }
    if (who <= 4) { return ranks.slice(0, 6); }
    return ranks.slice(who - 4, who + 2);
  } else if (typeof who === 'string') {
    // Textual representation of a number?
    if (who.match(/^\d+$/) !== null) {
      return decideWhichToShow(ranks, parseInt(who));
    } else {
      // Find the team's name (rather strict matching)
      let who_low = who.toLowerCase();
      for (let i = 0; i < ranks.length; i++) {
        if (ranks[i].team.toLowerCase().includes(who_low)) {
          return decideWhichToShow(ranks, i+1);
        }
      }
      // Nobody found, just show the top
      return decideWhichToShow(ranks, 1);
    }
  }
}

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let trimmedText = text.trim();
    let clGroupMatch = trimmedText.match(clGroupMatcher);
    let elGroupMatch = trimmedText.match(elGroupMatcher);
    let eplMatch = trimmedText.match(eplMatcher);
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
    } else if (eplMatch !== null) {
      epl.syncIfNeeded('1', function() {
        let res = epl.getGroup('1');
        res = decideWhichToShow(res.ranks, eplMatch[1]).map(oneTeamToString).join('; ');
        client.say(to, '[EPL] ' + res);
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
