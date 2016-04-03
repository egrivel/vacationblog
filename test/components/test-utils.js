'use strict';

var expect = require('chai').expect;

var utils = require('../../src/components/utils');

/**
 * Test for a single entity
 * @param {string} text - input entity
 * @param {string} result - resulting translated unicode
 */
function entity(text, result) {
  it('entity ' + text, function() {
    var mark1 = 'use the symbol [';
    var mark2 = '] in a string';
    var data = utils.replaceEntities(mark1 + text + mark2);
    expect(data).to.equal(mark1 + result + mark2);
  });
}

describe('/src/components/utils', function() {
  describe('#replaceEntities', function() {
    // Basic entities (UTF U+00A0 through U+00FF)

    // entity('&nbsp;', '\u00A0');
    // entity('&iexcl;', '\u00A1');
    // entity('&cent;', '\u00A2');
    // entity('&pound;', '\u00A3');
    // entity('&curren;', '\u00A4');
    // entity('&yen;', '\u00A5');
    // entity('&brvbar;', '\u00A6');
    // entity('&sect;', '\u00A7');
    // entity('&uml;', '\u00A8');
    // entity('&copy;', '\u00A9');
    // entity('&ordf;', '\u00AA');
    // entity('&laquo;', '\u00AB');
    // entity('&not;', '\u00AC');
    // entity('&shy;', '\u00AD');
    // entity('&reg;', '\u00AE');
    // entity('&macr;', '\u00AF');
    entity('&deg;', '\u00B0');
    // entity('&plusmn;', '\u00B1');
    entity('&sup2;', '\u00B2');
    // entity('&sup3;', '\u00B3');
    // entity('&acute;', '\u00B4');
    // entity('&micro;', '\u00B5');
    // entity('&para;', '\u00B6');
    // entity('&middot;', '\u00B7');
    // entity('&cedil;', '\u00B8');
    // entity('&sup1;', '\u00B9');
    // entity('&ordm;', '\u00BA');
    // entity('&raquo;', '\u00BB');
    entity('&frac14;', '\u00BC');
    entity('&frac12;', '\u00BD');
    // entity('&frac34;', '\u00BE');
    // entity('&iquest;', '\u00BF');
    // entity('&Agrave;', '\u00C0');
    // entity('&Aacute;', '\u00C1');
    // entity('&Acirc;', '\u00C2');
    // entity('&Atilde;', '\u00C3');
    // entity('&Auml;', '\u00C4');
    // entity('&Aring;', '\u00C5');
    // entity('&AElig;', '\u00C6');
    // entity('&Ccedil;', '\u00C7');
    // entity('&Egrave;', '\u00C8');
    // entity('&Eacute;', '\u00C9');
    // entity('&Ecirc;', '\u00CA');
    // entity('&Euml;', '\u00CB');
    // entity('&Igrave;', '\u00CC');
    // entity('&Iacute;', '\u00CD');
    // entity('&Icirc;', '\u00CE');
    // entity('&Iuml;', '\u00CF');
    // entity('&ETH;', '\u00D0');
    // entity('&Ntilde;', '\u00D1');
    // entity('&Ograve;', '\u00D2');
    // entity('&Oacute;', '\u00D3');
    // entity('&Ocirc;', '\u00D4');
    // entity('&Otilde;', '\u00D5');
    // entity('&Ouml;', '\u00D6');
    // entity('&times;', '\u00D7');
    // entity('&Oslash;', '\u00D8');
    // entity('&Ugrave;', '\u00D9');
    // entity('&Uacute;', '\u00DA');
    // entity('&Ucirc;', '\u00DB');
    // entity('&Uuml;', '\u00DC');
    // entity('&Yacute;', '\u00DD');
    // entity('&THORN;', '\u00DE');
    // entity('&szlig;', '\u00DF');
    entity('&agrave;', '\u00E0');
    entity('&aacute;', '\u00E1');
    // entity('&acirc;', '\u00E2');
    // entity('&atilde;', '\u00E3');
    // entity('&auml;', '\u00E4');
    // entity('&aring;', '\u00E5');
    // entity('&aelig;', '\u00E6');
    entity('&ccedil;', '\u00E7');
    entity('&egrave;', '\u00E8');
    entity('&eacute;', '\u00E9');
    entity('&ecirc;', '\u00EA');
    entity('&euml;', '\u00EB');
    // entity('&igrave;', '\u00EC');
    entity('&iacute;', '\u00ED');
    // entity('&icirc;', '\u00EE');
    // entity('&iuml;', '\u00EF');
    // entity('&eth;', '\u00F0');
    entity('&ntilde;', '\u00F1');
    // entity('&ograve;', '\u00F2');
    // entity('&oacute;', '\u00F3');
    entity('&ocirc;', '\u00F4');
    // entity('&otilde;', '\u00F5');
    entity('&ouml;', '\u00F6');
    // entity('&divide;', '\u00F7');
    // entity('&oslash;', '\u00F8');
    // entity('&ugrave;', '\u00F9');
    // entity('&uacute;', '\u00FA');
    // entity('&ucirc;', '\u00FB');
    entity('&uuml;', '\u00FC');
    // entity('&yacute;', '\u00FD');
    // entity('&thorn;', '\u00FE');
    // entity('&yuml;', '\u00FF');

    // Advanced entities
    entity('&omacron;', '\u014D');
    entity('&mdash;', '\u2014');
    entity('&lsquo;', '\u2018');
    entity('&rsquo;', '\u2019');
    entity('&apos;', '\u2019');  // alias
    entity('&ldquo;', '\u201C');
    entity('&rdquo;', '\u201D');

    // Special entities
    entity('&amp;', '&');
    entity('&quot;', '"');
    entity('&lf;', ' ');
    entity('&nl;', ' ');

    // multiple spaces
    entity('multiple  spaces', 'multiple spaces');
  });
});
