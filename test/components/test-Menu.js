'use strict';

/* global window */

var expect = require('chai').expect;
var sinon = require('sinon');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var Menu = require('../../src/components/Menu.jsx');
var MenuAction = require('../../src/actions/MenuAction');
var FeedbackAction = require('../../src/actions/FeedbackAction');

describe('components/Menu', function() {
  var menuData;
  var divComponent;

  var selectItemStub;
  var visibleItemStub;
  var loadFeedbackStub;

  beforeEach(function() {
    selectItemStub = sinon.stub(MenuAction, 'selectItem');
    visibleItemStub = sinon.stub(MenuAction, 'visibleItem');
    loadFeedbackStub = sinon.stub(FeedbackAction, 'loadData');
  });

  afterEach(function() {
    visibleItemStub.restore();
    selectItemStub.restore();
    loadFeedbackStub.restore();
  });

  describe('with simple structure', function() {
    var testId1 = 'test1';
    var testLabel1 = 'Test 1';
    var testTarget1 = '#target-1';
    var testId2 = 'test2';
    var testLabel2 = 'Test 2';
    var testTarget2 = '#target-2';

    beforeEach(function() {
      // Note: the visible attribute should not have any effect on
      // menu items that don't have a sub-menu.
      menuData = [
        {id: testId1, label: testLabel1, selected: true,
         visible: true, target: testTarget1},
        {id: testId2, label: testLabel2,
         visible: false, target: testTarget2}
      ];
      var component = TestUtils.renderIntoDocument(
        React.createElement(Menu, {menuData: menuData}));
      divComponent = ReactDOM.findDOMNode(component);
    });

    describe('#render', function() {
      it('render a list', function() {
        expect(divComponent.tagName).to.be.equal('DIV');
        var childComponent = divComponent.firstChild;
        expect(childComponent.tagName).to.be.equal('UL');
      });

      it('display each of the items in the menu', function() {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(2);
        expect(listItems[0].tagName).to.be.equal('LI');
        expect(listItems[1].tagName).to.be.equal('LI');
      });

      it('display A elements for menu items', function() {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(2);
        expect(listItems[0].firstChild.tagName).to.be.equal('A');
        expect(listItems[1].firstChild.tagName).to.be.equal('A');
      });

      it('display labels for menu items', function() {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(2);
        expect(listItems[0].firstChild.textContent).to.be.equal(testLabel1);
        expect(listItems[1].firstChild.textContent).to.be.equal(testLabel2);
      });

      it('display targets for menu items', function() {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(2);
        expect(listItems[0].firstChild.href).to.be.contain(testTarget1);
        expect(listItems[1].firstChild.href).to.be.contain(testTarget2);
      });

      it('render selected item with class', function() {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(2);
        expect(listItems[0].className).to.contain('selected');
        expect(listItems[1].className).to.not.contain('selected');
      });
    });

    describe('#handleSelect', function() {
      // The click has a delayed effect in calling visible action; make
      // sure the delayed effect is handled.
      it('select item action is called', function(done) {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(2);
        TestUtils.Simulate.click(listItems[0]);
        setTimeout(function() {
          expect(selectItemStub.args.length,
                 'number of calls to MenuAction.selectItem').to.be.equal(1);
          expect(selectItemStub.args[0].length,
                 'number arguments to MenuAction.selectItem').to.be.equal(1);
          expect(selectItemStub.args[0][0],
                 'argument to MenuAction.selectItem').to.be.equal(testId1);
          done();
        }, 200);
      });

      it('window location is set', function(done) {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(2);
        expect(window.location.href).to.not.contain(testTarget2);
        TestUtils.Simulate.click(listItems[1]);
        setTimeout(function() {
          expect(window.location.href).to.contain(testTarget2);
          done();
        }, 200);
      });
    });

    describe('#handleHover', function() {
      // Note: pass a done parameter to indicate that this test is
      // asynchronous, and call the done when the test is entirely
      // completed.
      it('visible item action is called', function(done) {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(2);

        // The mouse over should result in a call to the visible item
        // function, making the item visible.
        TestUtils.Simulate.mouseOver(listItems[0]);
        expect(visibleItemStub.args.length,
               'number of calls to MenuAction.visibleItem').to.be.equal(1);
        expect(visibleItemStub.args[0].length,
              'number arguments to MenuAction.visibleItem').to.be.equal(2);
        expect(visibleItemStub.args[0][0],
              'argument 0 to MenuAction.visibleItem').to.be.equal(testId1);
        expect(visibleItemStub.args[0][1],
              'argument 1 to MenuAction.visibleItem').to.be.equal(true);

        // The mouse out should result in a second call to the visible item
        // function, making the item invisible, but that second call only
        // hapens after a delay of 1/10th of a second.
        TestUtils.Simulate.mouseOut(listItems[0]);

        // Directly after the mouse out, no second call should have happened.
        expect(visibleItemStub.args.length,
               'number of calls to MenuAction.visibleItem directly after ' +
               'mouse out').to.be.equal(1);

        // Wait 2/10th of a second, then the second call should have taken
        // place.
        setTimeout(function() {
          expect(visibleItemStub.args.length,
                 'number of calls to MenuAction.visibleItem after a mouse ' +
                 'out and a wait').to.be.equal(2);
          expect(visibleItemStub.args[1].length,
                 'number arguments to MenuAction.visibleItem').to.be.equal(2);
          expect(visibleItemStub.args[1][0],
                 'argument 0 to MenuAction.visibleItem').to.be.equal(testId1);
          expect(visibleItemStub.args[1][1],
                 'argument 1 to MenuAction.visibleItem').to.be.equal(false);
          done();
        }, 200);
      });

      it('visible item action is not called if leaving hover for short time',
         function(done) {
           var listItems = divComponent.querySelectorAll('li');
           expect(listItems.length).to.be.equal(2);

           // The mouse over should result in a call to the visible item
           // function, making the item visible.
           TestUtils.Simulate.mouseOver(listItems[0]);
           expect(visibleItemStub.args.length,
                  'number of calls to MenuAction.visibleItem').to.be.equal(1);
           expect(visibleItemStub.args[0].length,
                  'number arguments to MenuAction.visibleItem').to.be.equal(2);
           expect(visibleItemStub.args[0][0],
                  'argument 0 to MenuAction.visibleItem').to.be.equal(testId1);
           expect(visibleItemStub.args[0][1],
                  'argument 1 to MenuAction.visibleItem').to.be.equal(true);

           // The mouse out should result in a second call to the visible item
           // function, making the item invisible, but that second call only
           // hapens after a delay of 1/10th of a second.
           TestUtils.Simulate.mouseOut(listItems[0]);

           // Directly after the mouse out, no second call should have happened.
           expect(visibleItemStub.args.length,
                  'number of calls to MenuAction.visibleItem directly after ' +
                  'mouse out').to.be.equal(1);

           // Move the mouse back over
           TestUtils.Simulate.mouseOver(listItems[0]);

           // There should be a second call to the visible function, again
           // setting visibility to true
           expect(visibleItemStub.args.length,
                  'number of calls to MenuAction.visibleItem directly after ' +
                  'mouse out').to.be.equal(2);
           expect(visibleItemStub.args[1].length,
                  'number arguments to MenuAction.visibleItem').to.be.equal(2);
           expect(visibleItemStub.args[1][0],
                  'argument 0 to MenuAction.visibleItem')
             .to.be.equal(testId1);
           expect(visibleItemStub.args[1][1],
                  'argument 1 to MenuAction.visibleItem').to.be.equal(true);

           // Wait 2/10th of a second, make sure there is not another call
           // to make the item invisible.
           setTimeout(function() {
             // there should not be a third call to visibility
             expect(visibleItemStub.args.length,
                 'number of calls to MenuAction.visibleItem after delay ' +
                 'and a wait').to.be.equal(2);
             done();
           }, 200);
         });
    });
  });

  /* eslint camelcase: [0] */
  describe('with a nested menu', function() {
    var testLabel1 = 'Test 1';
    var testLabel1_1 = 'Test 1.1';
    var testLabel1_2 = 'Test 1.2';
    var testLabel1_3 = 'Test 1.3';
    var testLabel2 = 'Test 2';
    var testLabel3 = 'Test 3';
    var testLabel3_1 = 'Test 3.1';
    var testLabel3_2 = 'Test 3.2';
    var testLabel3_3 = 'Test 3.3';

    var testTarget1_1 = 'target-1-1';
    var testTarget1_2 = 'target-1-2';
    var testTarget1_3 = 'target-1-3';
    var testTarget2 = 'target-2';
    var testTarget3_1 = 'target-3-1';
    var testTarget3_2 = 'target-3-2';
    var testTarget3_3 = 'target-3-3';

    beforeEach(function() {
      menuData = [
        {id: 'test1', label: testLabel1, submenu: [
          {id: 'test-1.1', label: testLabel1_1, target: testTarget1_1},
          {id: 'test-1.2', label: testLabel1_2, target: testTarget1_2},
          {id: 'test-1.3', label: testLabel1_3, target: testTarget1_3}
        ]},
        {id: 'test2', label: testLabel2, target: testTarget2},
        {id: 'test3', label: testLabel3, visible: true, submenu: [
          {id: 'test-3.1', label: testLabel3_1, target: testTarget3_1},
          {id: 'test-3.2', label: testLabel3_2, target: testTarget3_2},
          {id: 'test-3.3', label: testLabel3_3, target: testTarget3_3}
        ]}
      ];
      var component = TestUtils.renderIntoDocument(
        React.createElement(Menu, {menuData: menuData}));
      divComponent = ReactDOM.findDOMNode(component);
    });

    describe('#render', function() {
      it('render a list', function() {
        expect(divComponent.tagName).to.be.equal('DIV');
        var childComponent = divComponent.firstChild;
        expect(childComponent.tagName).to.be.equal('UL');
      });

      it('displays a visible submenu', function() {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(6);
        expect(listItems[2].firstChild, 'menu[2] has a span').to.exist;
        expect(listItems[2].firstChild.tagName,
               'menu[2].span has a tagname').to.exist;
        expect(listItems[2].firstChild.tagName).to.be.equal('SPAN');
        expect(listItems[2].children.length, 'number of children of li')
          .to.be.equal(2);
        expect(listItems[2].children[1],
               'menu[2] has a UL').to.exist;
        expect(listItems[2].children[1].tagName,
               'menu[2].ul has a tagname').to.exist;
        expect(listItems[2].children[1].tagName).to.be.equal('UL');
      });

      it('does not display an invisible submenu', function() {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(6);
        expect(listItems[0].children.length, 'number of children of li')
          .to.be.equal(1);
        expect(listItems[2].children.length, 'number of children of li')
          .to.be.equal(2);
      });

      it('display A and SPAN elements for menu items', function() {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(6);
        expect(listItems[0].firstChild.tagName).to.be.equal('SPAN');
        expect(listItems[1].firstChild.tagName).to.be.equal('A');
        expect(listItems[2].firstChild.tagName).to.be.equal('SPAN');
        expect(listItems[3].firstChild.tagName).to.be.equal('A');
        expect(listItems[4].firstChild.tagName).to.be.equal('A');
        expect(listItems[5].firstChild.tagName).to.be.equal('A');
      });

      it('display labels for menu items', function() {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(6);
        expect(listItems[0].firstChild.textContent).to.be.equal(testLabel1);
        expect(listItems[1].firstChild.textContent).to.be.equal(testLabel2);
        expect(listItems[2].firstChild.textContent).to.be.equal(testLabel3);
        expect(listItems[3].firstChild.textContent).to.be.equal(testLabel3_1);
        expect(listItems[4].firstChild.textContent).to.be.equal(testLabel3_2);
        expect(listItems[5].firstChild.textContent).to.be.equal(testLabel3_3);
      });

      it('display targets for menu items', function() {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(6);
        expect(listItems[0].firstChild.href).to.not.exist;
        expect(listItems[1].firstChild.href).to.contain(testTarget2);
        expect(listItems[2].firstChild.href).to.not.exist;
        expect(listItems[3].firstChild.href).to.contain(testTarget3_1);
        expect(listItems[4].firstChild.href).to.contain(testTarget3_2);
        expect(listItems[5].firstChild.href).to.contain(testTarget3_3);
      });
    });

    describe('#handleSelect', function() {
      // The click has a delayed effect in calling visible action; make
      // sure the delayed effect is handled.
      it('select submenu item not not call selectItem', function(done) {
        var listItems = divComponent.querySelectorAll('li');
        expect(listItems.length).to.be.equal(6);
        TestUtils.Simulate.click(listItems[2]);
        setTimeout(function() {
          expect(selectItemStub.args.length,
                 'number of calls to MenuAction.selectItem').to.be.equal(0);
          done();
        }, 200);
      });
    });
  });
});
