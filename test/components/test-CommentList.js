'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var TestUtils = require('react-addons-test-utils');

var CommentList = require('../../src/components/CommentList');

var UserStore = require('../../src/stores/UserStore');

describe('/src/components/CommentList', function() {
  var getUserDataStub;
  var testTripId = 'test-trip-1';
  var testUser1 = 'test-user-1';
  var testUserName = 'John Doe';

  beforeEach(function() {
    getUserDataStub = sinon.stub(UserStore, 'getData', function(userId) {
      if (userId === testUser1) {
        return {
          name: testUserName
        };
      }
      return null;
    });
  });

  afterEach(function() {
    getUserDataStub.restore();
  });

  describe('render single comment', function() {
    var element;
    var testText = 'this is a comment';
    var props = {
      tripId: testTripId,
      comments: [
        {
          commentId: 'B01',
          referenceId: 'ref1',
          userId: testUser1,
          commentText: testText
        }
      ]
    };

    beforeEach(function() {
      element = React.createElement(CommentList, props);
    });

    describe('structure', function() {
      it('<h3> elements', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var h3List = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'h3');
        expect(h3List.length).to.be.equal(1);
        expect(h3List[0].className).to.be.equal('');
      });

      it('<p> elements', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
        expect(parList.length).to.be.equal(1);
        expect(parList[0].className).to.be.equal('text');
      });

      it('<div> elements', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(comments,
          'div');
        expect(divList.length).to.be.equal(3);
        expect(divList[0].className).to.be.equal('comments');
        expect(divList[1].className).to.be.equal('commentBlock');
        expect(divList[2].className).to.be.equal('feedback');
      });
    });

    describe('render user name', function() {
      it('user name is in result', function() {
        var markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain(testUserName);
      });
    });

    describe('render content', function() {
      it('render paragraph', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
        expect(parList.length).to.be.equal(1);
        expect(parList[0].className).to.be.equal('text');
      });

      it('contains comment text', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
        expect(parList.length).to.be.equal(1);
        expect(parList[0].innerHTML).to.contain(testText);
      });
    });

    describe('render feedback', function() {
      it('render div', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(comments,
          'div');
        expect(divList.length).to.be.equal(3);
        expect(divList[2].className).to.be.equal('feedback');
      });
    });
  });

  describe('render list of comments', function() {
    var element;
    var testText1 = 'this is the first comment';
    var testText2 = 'this is the second comment';
    var props = {
      tripId: testTripId,
      comments: [
        {
          commentId: 'B01',
          referenceId: 'ref1',
          userId: testUser1,
          commentText: testText1
        },
        {
          commentId: 'B02',
          referenceId: 'ref1',
          userId: testUser1,
          commentText: testText2
        }
      ]
    };

    beforeEach(function() {
      element = React.createElement(CommentList, props);
    });

    describe('structure', function() {
      it('<h3> elements', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var h3List = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'h3');
        expect(h3List.length).to.be.equal(2);
        expect(h3List[0].className).to.be.equal('');
        expect(h3List[1].className).to.be.equal('');
      });

      it('<p> elements', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
        expect(parList.length).to.be.equal(2);
        expect(parList[0].className).to.be.equal('text');
        expect(parList[1].className).to.be.equal('text');
      });

      it('<div> elements', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(comments,
          'div');
        expect(divList.length).to.be.equal(5);
        expect(divList[0].className).to.be.equal('comments');
        expect(divList[1].className).to.be.equal('commentBlock');
        expect(divList[2].className).to.be.equal('feedback');
        expect(divList[3].className).to.be.equal('commentBlock');
        expect(divList[4].className).to.be.equal('feedback');
      });
    });

    describe('render content', function() {
      it('render paragraph', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
        expect(parList.length).to.be.equal(2);
        expect(parList[0].className).to.be.equal('text');
        expect(parList[1].className).to.be.equal('text');
      });

      it('contains comment text', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
        expect(parList.length).to.be.equal(2);
        expect(parList[0].innerHTML).to.contain(testText1);
        expect(parList[1].innerHTML).to.contain(testText2);
      });
    });

    describe('render feedback', function() {
      it('render div', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(comments,
          'div');
        expect(divList.length).to.be.equal(5);
        expect(divList[2].className).to.be.equal('feedback');
        expect(divList[4].className).to.be.equal('feedback');
      });
    });
  });

  describe('render nested list of comments', function() {
    var element;
    var testText1 = 'this is the first comment';
    var testText2 = 'this is the second comment';
    var testText3 = 'this is the third comment';
    var props = {
      tripId: testTripId,
      comments: [
        {
          commentId: 'B01',
          referenceId: 'ref1',
          userId: testUser1,
          commentText: testText1,
          childComments: [
            {
              commentId: 'B03',
              referenceId: 'B01',
              userId: testUser1,
              commentText: testText3
            }
          ]
        },
        {
          commentId: 'B02',
          referenceId: 'ref1',
          userId: testUser1,
          commentText: testText2
        }
      ]
    };

    beforeEach(function() {
      element = React.createElement(CommentList, props);
    });

    describe('structure', function() {
      it('<h3> elements', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var h3List = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'h3');
        expect(h3List.length).to.be.equal(3);
        expect(h3List[0].className).to.be.equal('');
        expect(h3List[1].className).to.be.equal('');
        expect(h3List[2].className).to.be.equal('');
      });

      it('<p> elements', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
        expect(parList.length).to.be.equal(3);
        expect(parList[0].className).to.be.equal('text');
        expect(parList[1].className).to.be.equal('text');
        expect(parList[2].className).to.be.equal('text');
      });

      it('<div> elements', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(comments,
          'div');
        expect(divList.length).to.be.equal(8);
        expect(divList[0].className).to.be.equal('comments');
        expect(divList[1].className).to.be.equal('commentBlock');
        expect(divList[2].className).to.be.equal('feedback');
        expect(divList[3].className).to.be.equal('comments');
        expect(divList[4].className).to.be.equal('commentBlock');
        expect(divList[5].className).to.be.equal('feedback');
        expect(divList[6].className).to.be.equal('commentBlock');
        expect(divList[7].className).to.be.equal('feedback');
      });
    });

    describe('render content', function() {
      it('render paragraph', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
        expect(parList.length).to.be.equal(3);
        expect(parList[0].className).to.be.equal('text');
        expect(parList[1].className).to.be.equal('text');
        expect(parList[2].className).to.be.equal('text');
      });

      it('contains comment text', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
        expect(parList.length).to.be.equal(3);
        expect(parList[0].innerHTML).to.contain(testText1);
        expect(parList[1].innerHTML).to.contain(testText3);
        expect(parList[2].innerHTML).to.contain(testText2);
      });
    });

    describe('render feedback', function() {
      it('render div', function() {
        var comments = TestUtils.renderIntoDocument(element);
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(comments,
          'div');
        expect(divList.length).to.be.equal(8);
        expect(divList[2].className).to.be.equal('feedback');
        expect(divList[5].className).to.be.equal('feedback');
        expect(divList[7].className).to.be.equal('feedback');
      });
    });
  });

  describe('special circumstances', function() {
    var element;
    var testText1;
    var props = {
      tripId: testTripId,
      comments: [
        {
          commentId: 'B01',
          referenceId: 'ref1',
          userId: testUser1,
          commentText: testText1
        }
      ]
    };

    beforeEach(function() {
      testText1 = 'this is the first comment';
      props.comments[0].commentText = testText1;
      props.comments[0].userId = testUser1;
    });

    it('empty text', function() {
      props.comments[0].commentText = null;
      element = React.createElement(CommentList, props);
      var comments = TestUtils.renderIntoDocument(element);
      var h3List = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'h3');
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
      var divList = TestUtils.scryRenderedDOMComponentsWithTag(comments,
        'div');
      expect(h3List.length).to.be.equal(1);
      expect(parList.length).to.be.equal(0);
      expect(divList.length).to.be.equal(3);
    });

    it('spaces only', function() {
      props.comments[0].commentText = ' &nl; ';
      element = React.createElement(CommentList, props);
      var comments = TestUtils.renderIntoDocument(element);
      var h3List = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'h3');
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
      var divList = TestUtils.scryRenderedDOMComponentsWithTag(comments,
        'div');
      expect(h3List.length).to.be.equal(1);
      expect(parList.length).to.be.equal(0);
      expect(divList.length).to.be.equal(3);
    });

    it('unknown user', function() {
      var nonExistingUser = 'test-non-existing-user';
      props.comments[0].userId = nonExistingUser;
      element = React.createElement(CommentList, props);
      var markup = ReactDOMServer.renderToStaticMarkup(element);
      expect(markup).to.contain(nonExistingUser);
    });

    it('deleted comment', function() {
      props.comments[0].deleted = 'Y';
      element = React.createElement(CommentList, props);

      // rendering a deleted comment results in an empty <div>, i.e. a dib
      // tag with a '<noscript>' element as content
      var comments = TestUtils.renderIntoDocument(element);
      var h3List = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'h3');
      var parList = TestUtils.scryRenderedDOMComponentsWithTag(comments, 'p');
      var divList = TestUtils.scryRenderedDOMComponentsWithTag(comments,
        'div');
      expect(h3List.length).to.be.equal(0);
      expect(parList.length).to.be.equal(0);
      expect(divList.length).to.be.equal(1);
      expect(divList[0].innerHTML).to.be.contain('<noscript');
    });
  });
});
