'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var AppDispatcher = require('../../src/AppDispatcher');
var MenuAction = require('../../src/actions/MenuAction');

describe('MenuAction stuff', function() {
  var dispatchStub;
  beforeEach(function() {
    dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
  });

  afterEach(function() {
    dispatchStub.restore();
  });

  describe('#selectItem', function() {
    it('dispatch is called with the right info', function() {
      var testMenuId = 'menu1';
      var data = {
        id: testMenuId
      };

      MenuAction.selectItem(testMenuId);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      var action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(MenuAction.Types.MENU_SELECT);
      expect(action.data).to.be.deep.eql(data);
    });
  });

  describe('#visibleItem', function() {
    it('dispatch is called with the right info for visible=true', function() {
      var testMenuId = 'menu1';
      var testVisible = true;
      var data = {
        id: testMenuId,
        visible: testVisible
      };

      MenuAction.visibleItem(testMenuId, testVisible);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      var action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(MenuAction.Types.MENU_VISIBLE);
      expect(action.data).to.be.deep.eql(data);
    });

    it('dispatch is called with the right info for visible=false', function() {
      var testMenuId = 'menu1';
      var testVisible = false;
      var data = {
        id: testMenuId,
        visible: testVisible
      };

      MenuAction.visibleItem(testMenuId, testVisible);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      var action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(MenuAction.Types.MENU_VISIBLE);
      expect(action.data).to.be.deep.eql(data);
    });
  });
});
