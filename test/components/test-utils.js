'use strict';

const expect = require('chai').expect;
import sinon from 'sinon';

import ReactDOMServer from 'react-dom/server';

import utils from '../../src/components/utils';

/**
 * Test for a single entity
 * @param {string} text - input entity
 * @param {string} result - resulting translated unicode
 */
function entity(text, result) {
  it('entity ' + text, function() {
    const mark1 = 'use the symbol [';
    const mark2 = '] in a string';
    const data = utils.replaceEntities(mark1 + text + mark2);
    expect(data).to.equal(mark1 + result + mark2);
  });
}

/**
 * Test all variations of markup
 * @param {string} description - description of the test set
 * @param {string} tag - markup tag to test
 * @param {string} replacement - replacement tag expected
 */
function markupTests(description, tag, replacement) {
  describe(description, function() {
    const testClassname = '';
    const testKey = '';

    it('single instance', function() {
      const testText = 'This is [' + tag + ']important[/' + tag + '] text.';
      const element = utils.buildTextNode('p', testClassname, testKey,
        testText);
      const markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.equal('<p>This is <' + replacement + '>important</' +
        replacement + '> text.</p>');
    });

    it('multiple instance', function() {
      const testText = 'This is [' + tag + ']important[/' + tag +
        '] text [' + tag + ']really[/' + tag + '].';
      const element = utils.buildTextNode('p', testClassname, testKey,
        testText);
      const markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.equal('<p>This is <' + replacement + '>important</' +
        replacement + '> text ' +
        '<' + replacement + '>really</' + replacement + '>.</p>');
    });

    it('handles missing open tag', function() {
      const testText = 'This is important[/' + tag + '] text.';
      const element = utils.buildTextNode('p', testClassname, testKey,
        testText);
      const markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.equal('<p>This is important[/' + tag + '] text.</p>');
    });

    it('handles missing close tag', function() {
      const testText = 'This is [' + tag + ']important text.';
      const element = utils.buildTextNode('p', testClassname, testKey,
        testText);
      const markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.equal('<p>This is <' + replacement +
        '>important text.</' + replacement + '></p>');
    });

    it('handles mangled open tag 1', function() {
      const testText = 'This is ' + tag + ']important[/' + tag + '] text.';
      const element = utils.buildTextNode('p', testClassname, testKey,
        testText);
      const markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.equal('<p>This is ' + tag + ']important[/' + tag +
        '] text.</p>');
    });

    it('handles mangled open tag 2', function() {
      const testText = 'This is [' + tag + 'important[/' + tag + '] text.';
      const element = utils.buildTextNode('p', testClassname, testKey,
        testText);
      const markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.equal('<p>This is [' + tag + 'important[/' + tag +
        '] text.</p>');
    });

    it('handles mangled close tag 1', function() {
      const testText = 'This is [' + tag + ']important/' + tag + '] text.';
      const element = utils.buildTextNode('p', testClassname, testKey,
        testText);
      const markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.equal('<p>This is <' + replacement + '>important/' +
        tag + '] text.</' + replacement + '></p>');
    });

    it('handles mangled close tag 2', function() {
      const testText = 'This is [' + tag + ']important[/' + tag + ' text.';
      const element = utils.buildTextNode('p', testClassname, testKey,
        testText);
      const markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.equal('<p>This is <' + replacement + '>important[/' +
        tag + ' text.</' + replacement + '></p>');
    });
  });
}

describe('components/utils', function() {
  describe('#replaceEntities', function() {
    describe('non-entities', function() {
      it('plain string is unchanged', function() {
        const plainString = ' This is a plain string without entities. ';
        const replaced = utils.replaceEntities(plainString);
        expect(replaced).to.equal(plainString);
      });
    });

    describe('entities', function() {
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

  describe('#buildTextNode', function() {
    const testClassname = 'test-classname';
    const testKey = 'test-key';
    describe('simple text', function() {
      const testText1 = 'This is a simple test.';
      it('returns p for type p', function() {
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText1);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain('<p');
      });

      it('includes classname for type p', function() {
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText1);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain('class=');
        expect(markup).to.contain(testClassname);
      });

      it('does not include empty classname for type p', function() {
        const element = utils.buildTextNode('p', '', testKey,
          testText1);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.not.contain('class=');
      });

      it('returns span for type span', function() {
        const element = utils.buildTextNode('span', testClassname, testKey,
          testText1);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain('<span');
      });

      it('does not include empty classname for type span', function() {
        const element = utils.buildTextNode('span', '', testKey,
          testText1);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.not.contain('class=');
      });

      it('includes classname for type span', function() {
        const element = utils.buildTextNode('span', testClassname, testKey,
          testText1);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain(testClassname);
      });

      it('returns nothing for other type', function() {
        const element = utils.buildTextNode('foo', testClassname, testKey,
          testText1);
        expect(element).to.be.undefined;
      });
    });

    markupTests('handles italic', 'EM', 'em');
    markupTests('handles bold', 'B', 'strong');
    markupTests('handles underline', 'U', 'u');

    describe('handles link', function() {
      const testClassname = '';
      const testKey = '';
      it('single instance', function() {
        const testText = 'This is [LINK http://foo/bar]important[/LINK] text.';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is ' +
          '<a href="http://foo/bar" target="_blank">important</a> text.</p>');
      });

      it('multiple instance', function() {
        const testText = 'This is [LINK http://foo/bar]important[/LINK] text ' +
        '[LINK http://one.two/three#four]really[/LINK].';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is ' +
          '<a href="http://foo/bar" target="_blank">important</a> text ' +
          '<a href="http://one.two/three#four" target="_blank">really</a>.</p>');
      });

      it('handles missing open tag', function() {
        const testText = 'This is important[/LINK] text.';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is ' +
          'important[/LINK] text.</p>');
      });

      it('handles missing close tag', function() {
        const testText = 'This is [LINK http://foo/bar]important text.';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is ' +
          '<a href="http://foo/bar" target="_blank">important text.</a></p>');
      });

      it('handles missing open tag open bracket', function() {
        const testText = 'This is LINK http://foo/bar]important[/LINK] text.';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is LINK http://foo/bar]important' +
          '[/LINK] text.</p>');
      });

      it('handles missing open tag close bracket', function() {
        const testText = 'This is [LINK http://foo/barimportant[/LINK] text.';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is ' +
          '<a href="http://foo/barimportant[/LINK" target="_blank"> ' +
          'text.</a></p>');
      });

      it('handles missing open tag close bracket and close tag', function() {
        const testText = 'This is [LINK http://foo/barimportant text.';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is http://foo/barimportant text.</p>');
      });

      it('handles missing close tag open bracket', function() {
        const testText = 'This is [LINK http://foo/bar]important/LINK] text.';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is ' +
          '<a href="http://foo/bar" target="_blank">important/LINK] ' +
          'text.</a></p>');
      });

      it('handles missing close tag close bracket', function() {
        const testText = 'This is [LINK http://foo/bar]important[/LINK text.';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is ' +
          '<a href="http://foo/bar" target="_blank">important[/LINK ' +
          'text.</a></p>');
      });

      it('handles missing space-url', function() {
        const testText = 'This is [LINK]important[/LINK] text.';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is [LINK]important[/LINK] text.</p>');
      });

      it('handles missing url', function() {
        const testText = 'This is [LINK ]important[/LINK] text.';
        const element = utils.buildTextNode('p', testClassname, testKey,
          testText);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.equal('<p>This is important[/LINK] text.</p>');
      });
    });

    describe('handle nested', function() {
      it('bold italic underline', function() {});
      const testText = '[B]This is [EM]important[/EM] and [EM][U]really ' +
        'important[/U][/EM] text.[/B]';
      const element = utils.buildTextNode('p', '', '', testText);
      const markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.equal('<p><strong>This is <em>important</em> and ' +
        '<em><u>really important</u></em> text.</strong></p>');
    });
  });

  describe('#formatDate', function() {
    let warningStub;
    beforeEach(function() {
      warningStub = sinon.stub(utils, 'warning');
    });

    afterEach(function() {
      warningStub.restore();
    });

    it('missing date gives null', function() {
      const result = utils.formatDate();
      expect(result).to.be.null;
      expect(warningStub.callCount).to.equal(0);
    });

    it('empty date gives null', function() {
      const result = utils.formatDate();
      expect(result).to.be.null;
      expect(warningStub.callCount).to.equal(0);
    });

    it('date in yyyymmdd format', function() {
      const result = utils.formatDate('20160102');
      expect(result).to.equal('Saturday January 2 2016');
      expect(warningStub.callCount).to.equal(0);
    });

    it('date in yyyy-mm-dd format', function() {
      const result = utils.formatDate('2016-02-03');
      expect(result).to.equal('Wednesday February 3 2016');
      expect(warningStub.callCount).to.equal(0);
    });

    it('date in yyyy-mm-dd hh:mm:ss.mmmmmm format', function() {
      const result = utils.formatDate('2016-04-05 06:07:08.333333');
      expect(result).to.equal('Tuesday April 5 2016 2:07:08am EDT');
      expect(warningStub.callCount).to.equal(0);
    });

    it('date in invalid format', function() {
      const result = utils.formatDate('anything else');
      expect(result).to.equal('anything else');
      expect(warningStub.callCount).to.equal(1);
    });
  });

  describe('#warning', function() {
    let consoleStub;
    beforeEach(function() {
      consoleStub = sinon.stub(console, 'log');
    });

    afterEach(function() {
      consoleStub.restore();
    });

    it('logs to the console', function() {
      const text = 'this is a warning';
      utils.warning(text);
      expect(consoleStub.callCount).to.equal(1);
      expect(consoleStub.args[0].length).to.equal(1);
      expect(consoleStub.args[0][0]).to.equal(text);
    });
  });

  describe('#splitText', function() {
    it('empty line', function() {
      const text = '';
      const result = utils.splitText(text);
      expect(result.length).to.be.equal(0);
    });

    it('spaces only', function() {
      const text = ' ';
      const result = utils.splitText(text);
      expect(result.length).to.be.equal(1);
      expect(result[0]).to.be.equal(text);
    });

    it('single line', function() {
      const text = 'This is one line';
      const result = utils.splitText(text);
      expect(result.length).to.be.equal(1);
      expect(result[0]).to.be.equal(text);
    });

    it('two lines', function() {
      const text1 = 'This is one line';
      const text2 = 'This is another line';
      const text = text1 + '&lf;' + text2;
      const result = utils.splitText(text);
      expect(result.length).to.be.equal(2);
      expect(result[0]).to.be.equal(text1);
      expect(result[1]).to.be.equal(text2);
    });

    it('three lines', function() {
      const text1 = 'This is one line';
      const text2 = 'This is another line';
      const text = text1 + '&lf;&lf;' + text2;
      const result = utils.splitText(text);
      expect(result.length).to.be.equal(3);
      expect(result[0]).to.be.equal(text1);
      expect(result[1]).to.be.equal('');
      expect(result[2]).to.be.equal(text2);
    });
  });
});
