'use strict';

/**
 * Takes some text and formats it for IRC.
 *
 * @param {String} text The text to format.
 * @param {String} how The type of formatting to apply.
 */
function formatText(text, how) {
  var controlCode = '\u0003';
  var resetCode = '\u000f';
  if (how === 'reverse') {
    return controlCode + '\u0016' + text + resetCode;
  } else if (how === 'bold') {
    return controlCode + '\u0002' + text + resetCode;
  } else {
    throw new Error('Incorrect formatting');
  }
}

exports.formatText = formatText;
