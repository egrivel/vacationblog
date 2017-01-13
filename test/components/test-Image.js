'use strict';

const _ = require('lodash');
const sinon = require('sinon');
const expect = require('chai').expect;
const React = require('react');
const TestUtils = require('react-addons-test-utils');

const Image = require('../../src/components/Image.jsx');
const Orientation = require('../../src/components/utils').orientation;

describe('components/Image', function() {
  const testTripId1 = 'test-tripid-1';
  const testImageId1 = 'test-imageid-1';
  const testImageId2 = 'test-imageid-2';
  const testFormat1 = Orientation.LANDSCAPE;
  const testFormat2 = Orientation.PORTRAIT;
  const testClassName1 = 'class-1';
  const testClassName2 = 'class-2';
  const testCaption1 = 'test captions 1';
  const testCaption2 = 'test captions 2';
  const testOnClick = _.noop;
  let props;

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
    let logStub;

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
      const component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      const img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.src).to.contain(testImageId1);
      expect(img.src).to.not.contain(testImageId2);
    });

    it('image ID ends up as part of the src (2)', function() {
      props.imageId = testImageId2;
      const component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      const img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.src).to.not.contain(testImageId1);
      expect(img.src).to.contain(testImageId2);
    });

    it('format ends up as part of the className (1)', function() {
      const component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      const img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.className).to.contain(testFormat1);
      expect(img.className).to.not.contain(testFormat2);
    });

    it('format ends up as part of the className (2)', function() {
      props.format = testFormat2;
      const component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      const img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.className).to.not.contain(testFormat1);
      expect(img.className).to.contain(testFormat2);
    });

    it('className ends up as part of the className (1)', function() {
      const component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      const img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.className).to.contain(testClassName1);
      expect(img.className).to.not.contain(testClassName2);
    });

    it('className ends up as part of the className (2)', function() {
      props.className = testClassName2;
      const component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      const img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.className).to.not.contain(testClassName1);
      expect(img.className).to.contain(testClassName2);
    });

    it('caption ends up as part of the title (1)', function() {
      const component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      const img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.title).to.contain(testCaption1);
      expect(img.title).to.not.contain(testCaption2);
    });

    it('caption ends up as part of the title (2)', function() {
      props.caption = testCaption2;
      const component =
       TestUtils.renderIntoDocument(React.createElement(Image, props));
      const img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(img.title).to.not.contain(testCaption1);
      expect(img.title).to.contain(testCaption2);
    });
  });

  describe('#onClick', function() {
    it('callback gets called if image is clicked', function() {
      const callback = sinon.stub();
      props.onClick = callback;
      const component =
        TestUtils.renderIntoDocument(React.createElement(Image, props));
      const img = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'img'
      );
      expect(callback.callCount).to.be.equal(0);
      TestUtils.Simulate.click(img);
      expect(callback.callCount).to.be.equal(1);
    });
  });
});
