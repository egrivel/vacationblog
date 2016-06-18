'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var React = require('react');
// var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');
var TestUtils = require('react-addons-test-utils');

var JournalParagraph = require('../../src/components/JournalParagraph.jsx');
var MediaStore = require('../../src/stores/MediaStore');

describe('components/JournalParagraph', function() {
  var mediaDataStub;
  var testTripId1 = 'test-trip-1';

  beforeEach(function() {
    mediaDataStub = sinon.stub(MediaStore, 'getData',
      function(tripId, mediaId) {
        var height;
        var width;
        switch (mediaId) {
          case '00000000-000000':
          case '22222222-222222':
          case '44444444-444444':
          case '66666666-666666':
          case '88888888-888888':
            height = 600;
            width = 900;
            break;
          case '11111111-111111':
          case '33333333-333333':
          case '55555555-555555':
          case '77777777-777777':
            height = 900;
            width = 600;
            break;
          case '99999999-999999':
            // special case to test failing media info
            return null;
          default:
            // should not happen
            break;
        }

        return {
          height: height,
          width: width,
          caption: 'Image ' + mediaId
        };
      });
  });

  afterEach(function() {
    mediaDataStub.restore();
  });

  describe('plain text paragraph', function() {
    var testText1 = 'test text 1';
    var testText2 = 'test with &aacute; a-acute';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a single paragraph', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
    });

    it('paragraph has text class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
      expect(parList[0].className).to.be.equal('text');
    });

    it('results in no images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(0);
    });

    it('text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.contain(testText1);
    });

    it('entities are replaced', function() {
      props.text = testText2;
      element = React.createElement(JournalParagraph, props);
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain(testText2);
      expect(markup).to.contain('test with \u00e1 a-acute');
    });

    it('no media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(0);
    });
  });

  describe('text with image paragraph', function() {
    var testText1 = 'test text [IMG 00000000-000000] with image';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a single paragraph', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
    });

    it('paragraph has img-text class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
      expect(parList[0].className).to.be.equal('img-text');
    });

    it('results in one image', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(1);
    });

    it('text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.contain('test text with image');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(1);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
    });
  });

  describe('text with multiple images paragraph', function() {
    var testText1 = 'test text [IMG 00000000-000000] ' +
      'with [IMG 11111111-111111] images';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a two paragraphs', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
    });

    it('first paragraph has text class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
      expect(parList[0].className).to.be.equal('text');
    });

    it('second paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
      expect(parList[1].className).to.be.equal('images two hv');
    });

    it('results in two images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(2);
    });

    it('text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(2);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('11111111-111111');
    });
  });

  describe('single image paragraph', function() {
    var testText1 = ' [IMG 00000000-000000] ';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a one paragraph', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
    });

    it('paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
      expect(parList[0].className).to.be.equal('images');
    });

    it('results in one image', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(1);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(1);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
    });
  });

  describe('two images mixed paragraph', function() {
    var testText1 = ' [IMG 00000000-000000]  [IMG 11111111-111111] ';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a one paragraph', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
    });

    it('paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
      expect(parList[0].className).to.be.equal('images two hv');
    });

    it('results in two images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(2);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(2);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('11111111-111111');
    });
  });

  describe('two images landscape paragraph', function() {
    var testText1 = ' [IMG 00000000-000000]  [IMG 22222222-222222] ';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a one paragraph', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
    });

    it('paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
      expect(parList[0].className).to.be.equal('images two hh');
    });

    it('results in two images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(2);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(2);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('22222222-222222');
    });
  });

  describe('two images portrait paragraph', function() {
    var testText1 = ' [IMG 11111111-111111]  [IMG 33333333-333333] ';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a one paragraph', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
    });

    it('paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
      expect(parList[0].className).to.be.equal('images two vv');
    });

    it('results in two images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(2);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(2);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('11111111-111111');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('33333333-333333');
    });
  });

  describe('three images mixed paragraph', function() {
    var testText1 = ' [IMG 00000000-000000]  [IMG 11111111-111111] ' +
      '[IMG 22222222-222222]';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a one paragraph', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
    });

    it('paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
      expect(parList[0].className).to.be.equal('images three hhv');
    });

    it('results in three images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(3);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(3);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('11111111-111111');
      expect(mediaDataStub.args[2][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[2][1]).to.equal('22222222-222222');
    });
  });

  describe('three images portrait paragraph', function() {
    var testText1 = ' [IMG 11111111-111111]  [IMG 33333333-333333] ' +
      '[IMG 55555555-555555]';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a one paragraph', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
    });

    it('paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
      expect(parList[0].className).to.be.equal('images three vvv');
    });

    it('results in three images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(3);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(3);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('11111111-111111');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('33333333-333333');
      expect(mediaDataStub.args[2][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[2][1]).to.equal('55555555-555555');
    });
  });

  describe('three images landscape paragraph', function() {
    var testText1 = ' [IMG 00000000-000000]  [IMG 22222222-222222] ' +
      '[IMG 44444444-444444]';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a one paragraph', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
    });

    it('paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(1);
      expect(parList[0].className).to.be.equal('images three hhh');
    });

    it('results in three images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(3);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(3);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('22222222-222222');
      expect(mediaDataStub.args[2][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[2][1]).to.equal('44444444-444444');
    });
  });

  describe('four images paragraph', function() {
    var testText1 = ' [IMG 00000000-000000]  [IMG 11111111-111111] ' +
      '[IMG 22222222-222222] [IMG 33333333-333333]';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a two paragraphs', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
    });

    it('first paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
      expect(parList[0].className).to.be.equal('images two hv');
    });

    it('second paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
      expect(parList[1].className).to.be.equal('images two hv');
    });

    it('results in four images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(4);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(4);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('11111111-111111');
      expect(mediaDataStub.args[2][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[2][1]).to.equal('22222222-222222');
      expect(mediaDataStub.args[3][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[3][1]).to.equal('33333333-333333');
    });
  });

  describe('five images paragraph', function() {
    var testText1 = ' [IMG 00000000-000000]  [IMG 11111111-111111] ' +
      '[IMG 22222222-222222] [IMG 33333333-333333] [IMG 44444444-444444]';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a two paragraphs', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
    });

    it('first paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
      expect(parList[0].className).to.be.equal('images three hhv');
    });

    it('second paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
      expect(parList[1].className).to.be.equal('images two hv');
    });

    it('results in five images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(5);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(5);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('11111111-111111');
      expect(mediaDataStub.args[2][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[2][1]).to.equal('22222222-222222');
      expect(mediaDataStub.args[3][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[3][1]).to.equal('33333333-333333');
      expect(mediaDataStub.args[4][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[4][1]).to.equal('44444444-444444');
    });
  });

  describe('six images paragraph', function() {
    var testText1 = ' [IMG 00000000-000000]  [IMG 11111111-111111] ' +
      '[IMG 22222222-222222] [IMG 33333333-333333] [IMG 44444444-444444]' +
      '[IMG 55555555-555555]';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a two paragraphs', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
    });

    it('first paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
      expect(parList[0].className).to.be.equal('images three hhv');
    });

    it('second paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(2);
      expect(parList[1].className).to.be.equal('images three hvv');
    });

    it('results in six images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(6);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(6);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('11111111-111111');
      expect(mediaDataStub.args[2][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[2][1]).to.equal('22222222-222222');
      expect(mediaDataStub.args[3][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[3][1]).to.equal('33333333-333333');
      expect(mediaDataStub.args[4][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[4][1]).to.equal('44444444-444444');
      expect(mediaDataStub.args[5][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[5][1]).to.equal('55555555-555555');
    });
  });

  describe('seven images paragraph', function() {
    var testText1 = ' [IMG 00000000-000000]  [IMG 11111111-111111] ' +
      '[IMG 22222222-222222] [IMG 33333333-333333] [IMG 44444444-444444]' +
      '[IMG 55555555-555555][IMG 66666666-666666]';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a three paragraphs', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(3);
    });

    it('first paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(3);
      expect(parList[0].className).to.be.equal('images three hhv');
    });

    it('second paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(3);
      expect(parList[1].className).to.be.equal('images two hv');
    });

    it('third paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(3);
      expect(parList[2].className).to.be.equal('images two hv');
    });

    it('results in six images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(7);
    });

    it('no text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.not.contain('test text with images');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(7);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('11111111-111111');
      expect(mediaDataStub.args[2][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[2][1]).to.equal('22222222-222222');
      expect(mediaDataStub.args[3][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[3][1]).to.equal('33333333-333333');
      expect(mediaDataStub.args[4][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[4][1]).to.equal('44444444-444444');
      expect(mediaDataStub.args[5][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[5][1]).to.equal('55555555-555555');
      expect(mediaDataStub.args[6][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[6][1]).to.equal('66666666-666666');
    });
  });

  describe('seven images with text paragraph', function() {
    var testText1 = ' [IMG 00000000-000000]  the[IMG 11111111-111111]text ' +
      '[IMG 22222222-222222] [IMG 33333333-333333]is [IMG 44444444-444444]' +
      '[IMG 55555555-555555][IMG 66666666-666666]included';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
    });

    it('results in a four paragraphs', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(4);
    });

    it('first paragraph has text class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(4);
      expect(parList[0].className).to.be.equal('text');
    });

    it('second paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(4);
      expect(parList[1].className).to.be.equal('images three hhv');
    });

    it('third paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(4);
      expect(parList[2].className).to.be.equal('images two hv');
    });

    it('fourth paragraph has images class', function() {
      var par = TestUtils.renderIntoDocument(element);
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'p');
      expect(parList.length).to.be.equal(4);
      expect(parList[3].className).to.be.equal('images two hv');
    });

    it('results in six images', function() {
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(7);
    });

    it('text is rendered', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.contain('the text is included');
    });

    it('media data retrieved', function() {
      ReactDOMServer.renderToStaticMarkup(element);
      expect(mediaDataStub.callCount).to.equal(7);
      expect(mediaDataStub.args[0][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[0][1]).to.equal('00000000-000000');
      expect(mediaDataStub.args[1][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[1][1]).to.equal('11111111-111111');
      expect(mediaDataStub.args[2][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[2][1]).to.equal('22222222-222222');
      expect(mediaDataStub.args[3][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[3][1]).to.equal('33333333-333333');
      expect(mediaDataStub.args[4][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[4][1]).to.equal('44444444-444444');
      expect(mediaDataStub.args[5][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[5][1]).to.equal('55555555-555555');
      expect(mediaDataStub.args[6][0]).to.equal(testTripId1);
      expect(mediaDataStub.args[6][1]).to.equal('66666666-666666');
    });
  });

  describe('modal window', function() {
    var testText1 = 'test text [IMG 00000000-000000] with image';
    var element;
    var props = {
      tripId: testTripId1,
      text: testText1
    };
    var par;

    beforeEach(function() {
      element = React.createElement(JournalParagraph, props);
      par = TestUtils.renderIntoDocument(element);
    });

    describe('before modal', function() {
      it('image list', function() {
        var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
        expect(imgList.length).to.equal(1);
        expect(imgList[0].className).to.be.equal('landscape');
        expect(imgList[0].src).to.contain('00000000-000000');
      });

      it('div list', function() {
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'div');
        expect(divList.length).to.be.equal(1);
        expect(divList[0].className).to.be.equal('');
      });
    });

    describe('click brings up modal', function() {
      beforeEach(function() {
        var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
        TestUtils.Simulate.click(imgList[0]);
      });

      it('image list', function() {
        var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
        expect(imgList.length).to.equal(2);
        expect(imgList[0].className).to.be.equal('landscape', 'first image');
        expect(imgList[0].src).to.contain('00000000-000000');
        expect(imgList[1].className).to.be.equal('landscape modal-img',
          'second image');
        expect(imgList[1].src).to.contain('00000000-000000');
      });

      it('div list', function() {
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'div');
        expect(divList.length).to.be.equal(4);
        expect(divList[0].className).to.be.equal('');
        expect(divList[1].className).to.be.equal('modal');
        expect(divList[2].className).to.be.equal('modal-content');
        expect(divList[3].className).to.be.equal('modal-image-caption');
      });
    });

    describe('second click removes modal', function() {
      beforeEach(function() {
        var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
        TestUtils.Simulate.click(imgList[0]);
        imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
        TestUtils.Simulate.click(imgList[0]);
      });

      it('image list', function() {
        var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
        expect(imgList.length).to.equal(1);
        expect(imgList[0].className).to.be.equal('landscape');
        expect(imgList[0].src).to.contain('00000000-000000');
      });

      it('div list', function() {
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'div');
        expect(divList.length).to.be.equal(1);
        expect(divList[0].className).to.be.equal('');
      });
    });

    describe('clicking on modal removes modal', function() {
      beforeEach(function() {
        var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
        TestUtils.Simulate.click(imgList[0]);
        imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'div');
        // second div is the modal div
        TestUtils.Simulate.click(imgList[1]);
      });

      it('image list', function() {
        var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
        expect(imgList.length).to.equal(1);
        expect(imgList[0].className).to.be.equal('landscape');
        expect(imgList[0].src).to.contain('00000000-000000');
      });

      it('div list', function() {
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'div');
        expect(divList.length).to.be.equal(1);
        expect(divList[0].className).to.be.equal('');
      });
    });
  });

  describe('miscellaneous conditions', function() {
    it('failing media info results in landscape', function() {
      var testText1 = ' [IMG 99999999-999999] ';
      var props = {
        tripId: testTripId1,
        text: testText1
      };

      var element = React.createElement(JournalParagraph, props);
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(1);
      expect(imgList[0].className).to.contain('landscape');
    });

    it('img tag without start', function() {
      var testText1 = ' IMG 00000000-000000] ';
      var props = {
        tripId: testTripId1,
        text: testText1
      };

      var element = React.createElement(JournalParagraph, props);
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(0);

      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.contain(' IMG 00000000-000000]');
    });

    it('img tag without end', function() {
      var testText1 = ' [IMG 00000000-000000 ';
      var props = {
        tripId: testTripId1,
        text: testText1
      };

      var element = React.createElement(JournalParagraph, props);
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(0);

      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.contain(' [IMG 00000000-000000 ');
    });

    it('invalid img tag', function() {
      var testText1 = ' [IMG 123+456] ';
      var props = {
        tripId: testTripId1,
        text: testText1
      };

      var element = React.createElement(JournalParagraph, props);
      var par = TestUtils.renderIntoDocument(element);
      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(par, 'img');
      expect(imgList.length).to.be.equal(0);

      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.contain(' [IMG 123+456] ');
    });

    it('empty text', function() {
      var testText1 = '';
      var props = {
        tripId: testTripId1,
        text: testText1
      };

      var element = React.createElement(JournalParagraph, props);
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      // nothing gets returned
      expect(markup).to.contain('<noscript>');
    });

    it('spaces only text', function() {
      var testText1 = '   ';
      var props = {
        tripId: testTripId1,
        text: testText1
      };

      var element = React.createElement(JournalParagraph, props);
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      // nothing gets returned
      expect(markup).to.contain('<noscript>');
    });

    it('missing text prop', function() {
      var props = {
        tripId: testTripId1
      };

      var element = React.createElement(JournalParagraph, props);
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      // nothing gets returned
      expect(markup).to.contain('<noscript>');
    });
  });
});
