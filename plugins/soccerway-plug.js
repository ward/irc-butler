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
function oneGameToString(game) {
  if (game.score.search(':') > -1) {
    // Convoluted hacky fixing of the timezone...
    let time = game.score;
    let hour = parseInt(time.substring(0, time.search(':')));
    hour = hour - 1;// time offset
    let minutes = time.substring(time.search(':'));
    time = hour.toString() + minutes;
    return game.date + ' ' + time + ' ' + game.home + '-' + game.away;
  }
  return game.home + ' ' + game.score + ' ' + game.away;
}

const cl = new Soccerway({
  'A': 'https://int.soccerway.com/international/europe/uefa-champions-league/20192020/group-stage/group-a/g14741/',
  'B': 'https://int.soccerway.com/international/europe/uefa-champions-league/20192020/group-stage/group-b/g14742/',
  'C': 'https://int.soccerway.com/international/europe/uefa-champions-league/20192020/group-stage/group-c/g14743/',
  'D': 'https://int.soccerway.com/international/europe/uefa-champions-league/20192020/group-stage/group-d/g14744/',
  'E': 'https://int.soccerway.com/international/europe/uefa-champions-league/20192020/group-stage/group-e/g14745/',
  'F': 'https://int.soccerway.com/international/europe/uefa-champions-league/20192020/group-stage/group-f/g14746/',
  'G': 'https://int.soccerway.com/international/europe/uefa-champions-league/20192020/group-stage/group-g/g14747/',
  'H': 'https://int.soccerway.com/international/europe/uefa-champions-league/20192020/group-stage/group-h/g14748/',
  'stages': 'https://int.soccerway.com/international/europe/uefa-champions-league/20192020/s17689/final-stages/'
});

const clGroupMatcher = /^!(?:rank|stand)(?:ings?)? +u?cl +([A-H])$/i;

const el = new Soccerway({
  'A': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-a/g14707/',
  'B': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-b/g14708/',
  'C': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-c/g14709/',
  'D': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-d/g14710/',
  'E': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-e/g14711/',
  'F': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-f/g14712/',
  'G': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-g/g14713/',
  'H': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-h/g14714/',
  'I': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-i/g14715/',
  'J': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-j/g14716/',
  'K': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-k/g14717/',
  'L': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/group-stage/group-l/g14718/',
  'stages': 'https://int.soccerway.com/international/europe/uefa-cup/20192020/s17653/final-stages/'
});

const elGroupMatcher = /^!(?:rank|stand)(?:ings?)? +el +([A-L])$/i;

const leagues = [
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/england/premier-league/20192020/regular-season/r53145/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:eng|england|epl)(?: +(.+))?$/i,
    'name': 'EPL',
  },
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/belgium/pro-league/20192020/regular-season/r53516/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +bel(?:gium|gie)?(?: +(.+))?$/i,
    'name': 'BEL',
  },
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/spain/primera-division/20192020/regular-season/r53502/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:spa(?:in)?|(?:la ?)?liga)(?: +(.+))?$/i,
    'name': 'LIGA',
  },
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/germany/bundesliga/20192020/regular-season/r53499/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:deu|ger(?:many?)?|bund(?:es|esliga)?)(?: +(.+))?$/i,
    'name': 'DEU',
  },
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/netherlands/eredivisie/20192020/regular-season/r54058/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:nld|ned|netherlands|ere(?:divisie)?)(?: +(.+))?$/i,
    'name': 'NLD',
  },
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/italy/serie-a/20192020/regular-season/r54890/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:ita(?:ly)?|serie ?a?)(?: +(.+))?$/i,
    'name': 'ITA',
  },
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/france/ligue-1/20192020/regular-season/r53638/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:fra(?:nce)?|ligue ?1?)(?: +(.+))?$/i,
    'name': 'FRA',
  },
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/portugal/portuguese-liga-/20192020/regular-season/r53517/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:por(?:tugal)?|primeira(?:.liga)?)(?: +(.+))?$/i,
    'name': 'POR',
  },
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/england/championship/20192020/regular-season/r53782/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:championship|e?pl2|eng(?:land)?2)(?: +(.+))?$/i,
    'name': 'ENG2',
  },
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/ukraine/premier-league/20192020/regular-season/r54067/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:ukr(?:aine)?|upl)(?: +(.+))?$/i,
    'name': 'UKR',
  },
  {
    'soccerway': new Soccerway({
      '1': 'https://int.soccerway.com/national/singapore/sleague/2020/regular-season/r56009/',
    }),
    'matcher': /^!(?:rank|stand)(?:ings?)? +(?:singa?(?:pore|poor)?)(?: +(.+))?$/i,
    'name': 'SGP',
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

const wc = new Soccerway({
  'A': 'https://int.soccerway.com/international/world/womens-world-cup/2019-france/group-stage/group-a/g13755/',
  'B': 'https://int.soccerway.com/international/world/womens-world-cup/2019-france/group-stage/group-b/g13756/',
  'C': 'https://int.soccerway.com/international/world/womens-world-cup/2019-france/group-stage/group-c/g13757/',
  'D': 'https://int.soccerway.com/international/world/womens-world-cup/2019-france/group-stage/group-d/g13758/',
  'E': 'https://int.soccerway.com/international/world/womens-world-cup/2019-france/group-stage/group-e/g13759/',
  'F': 'https://int.soccerway.com/international/world/womens-world-cup/2019-france/group-stage/group-f/g13760/',
  'stages': 'https://int.soccerway.com/international/world/womens-world-cup/2019-france/s11947/final-stages/'
});

// const wcGroupMatcher = /^!(?:(?:rank|stand)(?:ings?)? +)?w(?:orld)?[. -]*c(?:up)? +([A-H])$/i;
// const wcStagesMatcher = /^!(?:(?:rank|stand)(?:ings?)? +)?w(?:orld)?[. -]*c(?:up)? +(.+)$/i;
// Female variant
const wcGroupMatcher = /^!(?:(?:rank|stand)(?:ings?)? +)?(?:w(?:omen)?[. -]*)?w(?:orld)?[. -]*c(?:up)? +([A-H])$/i;
const wcStagesMatcher = /^!(?:(?:rank|stand)(?:ings?)? +)?(?:w(?:omen)?[. -]*)?w(?:orld)?[. -]*c(?:up)? +(.+)$/i;

exports.activateOn = function(client) {
  client.addListener('message#', function(from, to, text) {
    let trimmedText = text.trim();
    let clGroupMatch = trimmedText.match(clGroupMatcher);
    let elGroupMatch = trimmedText.match(elGroupMatcher);
    let wcGroupMatch = null;// trimmedText.match(wcGroupMatcher);
    let wcStagesMatch = null;// trimmedText.match(wcStagesMatcher);
    if (clGroupMatch !== null) {
      let group = clGroupMatch[1].toUpperCase();
      cl.syncIfNeeded(group, function() {
        let res = cl.getGroup(group);
        res = res.ranks
          .map(oneTeamToString)
          .join('; ');
        client.say(to, '[GROUP ' + group + '] ' + res);
      });
    } else if (elGroupMatch !== null) {
      let group = elGroupMatch[1].toUpperCase();
      el.syncIfNeeded(group, function() {
        let res = el.getGroup(group);
        res = res.ranks
          .map(oneTeamToString)
          .join('; ');
        client.say(to, '[GROUP ' + group + '] ' + res);
      });
    } else if (wcGroupMatch !== null) {
      let group = wcGroupMatch[1].toUpperCase();
      wc.syncIfNeeded(group, function() {
        let res = wc.getGroup(group);
        let positions = res.ranks
          .map(oneTeamToString)
          .join('; ');
        let games = res.games
          .map(oneGameToString)
          .map(s => s.replace('/18',''))
          .join('; ');
        client.say(to, '[GROUP ' + group + '] ' + positions + ' --- ' + games);
      });
    } else if (wcStagesMatch !== null) {
      let stage = wcStagesMatch[1];
      // Can be fuzzy because we break after the first match
      // [Regex match, name, slicebegin, sliceend]
      let stageMatchers = [
        [/8|eight|16/i, 'R16', 8, 16],
        [/quarter|4|Q/i, 'QF', 4, 8],
        [/semi|2|half|sf/i, 'SF', 2, 4],
        [/3|third|three/i, '3RD', 1, 2],
        [/final|end|cup/i, 'FINAL', 0, 1]
      ];
      for (let i = 0; i < stageMatchers.length; i++) {
        let match = stage.match(stageMatchers[i][0]);
        if (match !== null) {
          wc.syncIfNeeded('stages', function() {
            let games = wc.getStages();
            let relevantGames = games.slice(stageMatchers[i][2], stageMatchers[i][3]);
            let relevantGamesString = relevantGames
              .map(oneGameToString)
              .map(s => s.replace('/19', ''))
              .join('; ');
            client.say(to, '[' + stageMatchers[i][1] + '] ' + relevantGamesString);
          });
          break;
        }
      }
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
