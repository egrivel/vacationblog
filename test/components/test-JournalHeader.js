'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var TestUtils = require('react-addons-test-utils');

var JournalHeader = require('../../src/components/JournalHeader.jsx');

describe('components/JournalHeader', function() {
  var testTitle1 = 'test title 1';
  var testTitle2 = 'test title 2';
  var testDate1 = '2015-01-01';
  var testDate2 = '2015-01-02';
  var testUserName1 = 'test user 1';
  var testUserName2 = 'test user 2';
  var testCreated0 = '0000-00-00 00:00:00.000000';
  var testCreated1 = '2015-02-01 09:00:00.000000';
  var testCreated2 = '2015-02-02 09:00:00.000000';
  var props;

  beforeEach(function() {
    props = {
      title: testTitle1,
      date: testDate1,
      userName: testUserName1,
      created: testCreated1
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
      React.createElement(JournalHeader, props);
      expect(logStub.callCount).to.be.equal(0);
    });

    it('no error on missing title', function() {
      delete props.title;
      React.createElement(JournalHeader, props);
      expect(logStub.callCount).to.be.equal(0);
    });

    it('error on non-string title', function() {
      props.title = true;
      React.createElement(JournalHeader, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`title`');
    });

    it('no error on missing date', function() {
      delete props.date;
      React.createElement(JournalHeader, props);
      expect(logStub.callCount).to.be.equal(0);
    });

    it('error on non-string date', function() {
      props.date = true;
      React.createElement(JournalHeader, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`date`');
    });

    it('no error on missing userName', function() {
      delete props.userName;
      React.createElement(JournalHeader, props);
      expect(logStub.callCount).to.be.equal(0);
    });

    it('error on non-string userName', function() {
      props.userName = true;
      React.createElement(JournalHeader, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`userName`');
    });

    it('no error on missing created', function() {
      delete props.created;
      React.createElement(JournalHeader, props);
      expect(logStub.callCount).to.be.equal(0);
    });

    it('error on non-string created', function() {
      props.created = true;
      React.createElement(JournalHeader, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`created`');
    });
  });

  describe('#render', function() {
    it('renders an <h3> element', function() {
      var component =
        TestUtils.renderIntoDocument(
          React.createElement(JournalHeader, props));
      var h3 = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'h3'
      );
      expect(h3).to.not.be.null;
    });

    it('includes the title if given (1)', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.contain(testTitle1);
      expect(markup).to.not.contain(testTitle2);
    });

    it('includes the title if given (2)', function() {
      props.title = testTitle2;
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.not.contain(testTitle1);
      expect(markup).to.contain(testTitle2);
    });

    it('includes (Untitled) if no title is given', function() {
      delete props.title;
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.contain('(Untitled)');
    });

    it('includes the date if given (1)', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.contain('Thursday January 1 2015: ');
      expect(markup).to.not.contain('Friday January 2 2015: ');
    });

    it('includes the date if given (2)', function() {
      props.date = testDate2;
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.not.contain('Thursday January 1 2015: ');
      expect(markup).to.contain('Friday January 2 2015: ');
    });

    it('does not include a date if no date is given', function() {
      delete props.date;
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.contain('>' + testTitle1 + '<');
    });

    it('includes subtitle span', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.contain('"subtitle"');
    });

    it('includes "by username" if given (1)', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.contain('<em>by</em> ' + testUserName1);
      expect(markup).to.not.contain('<em>by</em> ' + testUserName2);
    });

    it('includes "by username" if given (2)', function() {
      props.userName = testUserName2;
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.not.contain('<em>by</em> ' + testUserName1);
      expect(markup).to.contain('<em>by</em> ' + testUserName2);
    });

    it('not include "by" if no username is given', function() {
      delete props.userName;
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.not.contain('<em>by</em>');
    });

    it('includes created if given (1)', function() {
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.contain(
        ' (Sunday February 1 2015 4:00:00am EST)</span>');
      expect(markup).to.not.contain(
        ' (Monday February 2 2015 4:00:00am EST)</span>');
    });

    it('includes created if given (2)', function() {
      props.created = testCreated2;
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.not.contain(
        ' (Sunday February 1 2015 4:00:00am EST)</span>');
      expect(markup).to.contain(
        ' (Monday February 2 2015 4:00:00am EST)</span>');
    });

    it('not includes created if not given (1)', function() {
      delete props.created;
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.contain(testUserName1 + '</span>');
    });

    it('not includes created if not given (2)', function() {
      props.created = testCreated0;
      var markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(JournalHeader, props));
      expect(markup).to.contain(testUserName1 + '</span>');
    });

    it('does not includes subtitle span without username or created',
      function() {
        delete props.userName;
        delete props.created;
        var markup = ReactDOMServer.renderToStaticMarkup(
          React.createElement(JournalHeader, props));
        expect(markup).to.not.contain('"subtitle"');
      }
    );
  });
});
