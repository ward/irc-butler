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
  'G': 'http://int.soccerway.com/international/europe/uefa-champions-league/20172018/group-stage/group-g/g11486/',
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

const leagues = [
  {
    'soccerway': new Soccerway({
      '1': 'http://int.soccerway.com/national/england/premier-league/20172018/regular-season/r41547/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +epl(?: +(.+))?$/i,
    'name': 'EPL',
  },
  {
    'soccerway': new Soccerway({
      '1': 'http://int.soccerway.com/national/belgium/pro-league/20172018/regular-season/r41608/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +bel(?:ium|ie)?(?: +(.+))?$/i,
    'name': 'BEL',
  },
  {
    'soccerway': new Soccerway({
      '1': 'http://int.soccerway.com/national/spain/primera-division/20172018/regular-season/r41509/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:spa(?:in)?|(?:la ?)?liga)(?: +(.+))?$/i,
    'name': 'LIGA',
  },
  {
    'soccerway': new Soccerway({
      '1': 'http://int.soccerway.com/national/germany/bundesliga/20172018/regular-season/r41485/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:deu|ger|bund(?:es|esliga)?)(?: +(.+))?$/i,
    'name': 'DEU',
  },
  {
    'soccerway': new Soccerway({
      '1': 'http://int.soccerway.com/national/netherlands/eredivisie/20172018/regular-season/r42274/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:nld|ned|netherlands|ere(?:divisie)?)(?: +(.+))?$/i,
    'name': 'NLD',
  },
  {
    'soccerway': new Soccerway({
      '1': 'http://int.soccerway.com/national/italy/serie-a/20172018/regular-season/r42011/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:ita(?:ly)?|serie ?a?)(?: +(.+))?$/i,
    'name': 'ITA',
  },
  {
    'soccerway': new Soccerway({
      '1': 'http://int.soccerway.com/national/france/ligue-1/20172018/regular-season/r41646/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:fra(?:nce)?|ligue ?1?)(?: +(.+))?$/i,
    'name': 'FRA',
  },
  {
    'soccerway': new Soccerway({
      '1': 'http://int.soccerway.com/national/portugal/portuguese-liga-/20172018/regular-season/r41648/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:por(?:tugal)?|primeira(?:.liga)?)(?: +(.+))?$/i,
    'name': 'POR',
  },
];

/**
 * @param ranks is the ranks result of a Soccerway group
 * @param who can be:
 * - undefined: first 6 are picked
 * - a (partial) team name: name is matched, position found, function called with position
 * - a number: position to show, 5 surrounding it will also be shown
 * @return up to 6 positions of the ranks result
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
    } else {
      for (let i = 0; i < leagues.length; i++) {
        let match = trimmedText.match(leagues[i].matcher);
        if (match !== null) {
          leagues[i].soccerway.syncIfNeeded('1', function() {
            let res = leagues[i].soccerway.getGroup('1');
            res = decideWhichToShow(res.ranks, match[1]).map(oneTeamToString).join('; ');
            client.say(to, '[' + leagues[i].name + '] ' + res);
          });
          break;
        }
      }
    }
  });
};
exports.info = {
  id: 'rank',
  version: '0.1.0',
  description: 'Show ranking for various leagues and competitions',
  commands: [
    {
      trigger: '!rank CL/EL GROUPLETTER',
      description: 'Show standings for GROUP'
    },
    {
      trigger: '!rank LEAGUE [POSITION|TEAM]',
      description: ' Show league standings or center it around a certain position/team.'
    },
  ]
};
