'use strict';

var _ = require('lodash');
var sinon = require('sinon');
var expect = require('chai').expect;
var React = require('react');
var TestUtils = require('react-addons-test-utils');

var Image = require('../../src/components/Image.jsx');
var Orientation = require('../../src/components/utils').orientation;

describe('Image component', function() {
  var testTripId1 = 'test-tripid-1';
  var testImageId1 = 'test-imageid-1';
  var testImageId2 = 'test-imageid-2';
  var testFormat1 = Orientation.LANDSCAPE;
  var testFormat2 = Orientation.PORTRAIT;
  var testClassName1 = 'class-1';
  var testClassName2 = 'class-2';
  var testCaption1 = 'test captions 1';
  var testCaption2 = 'test captions 2';
  var testOnClick = _.noop;
  var props;

  beforeEach(function() {
    props = {
      tripId: testTripId1,
      imageId: testImageId1,
      format: testFormat1,
      className: testClassName1,
      caption: testCaption1,
      onClick: testOnClick
    };
  });

  describe('#propTypes', function() {
    var logStub;

    beforeEach(function() {
      // React will give errors about the proptyps on the error console,
      // so stub that to capture the error messages
      logStub = sinon.stub(console, 'error');
    });

    afterEach(function() {
      logStub.restore();
    });

    it('accepts valid props', function() {
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(0);
    });

    it('error on missing tripId', function() {
      delete props.tripId;
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      // check that the error message about a required prop is given
      expect(logStub.args[0][0]).to.contain('Required prop');
      // check that the error message is actually about this prop
      expect(logStub.args[0][0]).to.contain('`tripId`');
    });

    it('error on non-string tripId', function() {
      props.tripId = true;
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`tripId`');
    });

    it('error on missing imageId', function() {
      delete props.imageId;
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Required prop');
      expect(logStub.args[0][0]).to.contain('`imageId`');
    });

    it('error on non-string imageId', function() {
      props.imageId = true;
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`imageId`');
    });

    it('error on missing format', function() {
      delete props.format;
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Required prop');
      expect(logStub.args[0][0]).to.contain('`format`');
    });

    it('error on wrong value for format', function() {
      props.format = 'format';
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`format`');
    });

    it('error on non-string format', function() {
      props.format = true;
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`format`');
    });

    it('no error on missing className', function() {
      delete props.className;
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(0);
    });

    it('error on non-string className', function() {
      props.className = true;
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`className`');
    });

    it('no error on missing onClick', function() {
      delete props.onClick;
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(0);
    });

    it('error on non-function onClick', function() {
      props.onClick = 'string';
      React.createElement(Image, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`onClick`');
    });
  });

  describe('#render', function() {
    it('image ID ends up as part of the src (1)', function() {
      var component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      var img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.src).to.contain(testImageId1);
      expect(img.src).to.not.contain(testImageId2);
    });

    it('image ID ends up as part of the src (2)', function() {
      props.imageId = testImageId2;
      var component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      var img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.src).to.not.contain(testImageId1);
      expect(img.src).to.contain(testImageId2);
    });

    it('format ends up as part of the className (1)', function() {
      var component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      var img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.className).to.contain(testFormat1);
      expect(img.className).to.not.contain(testFormat2);
    });

    it('format ends up as part of the className (2)', function() {
      props.format = testFormat2;
      var component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      var img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.className).to.not.contain(testFormat1);
      expect(img.className).to.contain(testFormat2);
    });

    it('className ends up as part of the className (1)', function() {
      var component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      var img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.className).to.contain(testClassName1);
      expect(img.className).to.not.contain(testClassName2);
    });

    it('className ends up as part of the className (2)', function() {
      props.className = testClassName2;
      var component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      var img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.className).to.not.contain(testClassName1);
      expect(img.className).to.contain(testClassName2);
    });

    it('caption ends up as part of the title (1)', function() {
      var component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      var img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.title).to.contain(testCaption1);
      expect(img.title).to.not.contain(testCaption2);
    });

    it('caption ends up as part of the title (2)', function() {
      props.caption = testCaption2;
      var component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      var img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.title).to.not.contain(testCaption1);
      expect(img.title).to.contain(testCaption2);
    });
  });

  describe('#onClick', function() {
    it('callback gets called if image is clicked', function() {
      var callback = sinon.stub();
      props.onClick = callback;
      var component =
        TestUtils.renderIntoDocument(React.createElement(Image, props));
      var img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(callback.callCount).to.be.equal(0);
      TestUtils.Simulate.click(img);
      expect(callback.callCount).to.be.equal(1);
    });
  });
});
