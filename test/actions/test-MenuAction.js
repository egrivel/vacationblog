'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const AppDispatcher = require('../../src/AppDispatcher');
const MenuAction = require('../../src/actions/MenuAction');

describe('actions/MenuAction', function() {
  let dispatchStub;
  beforeEach(function() {
    dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
  });

  afterEach(function() {
    dispatchStub.restore();
  });

  describe('#selectItem', function() {
    it('dispatch is called with the right info', function() {
      const testMenuId = 'menu1';
      const data = {
        id: testMenuId
      };

      MenuAction.selectItem(testMenuId);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(MenuAction.Types.MENU_SELECT);
      expect(action.data).to.be.deep.eql(data);
    });
  });

  describe('#visibleItem', function() {
    it('dispatch is called with the right info for visible=true', function() {
      const testMenuId = 'menu1';
      const testVisible = true;
      const data = {
        id: testMenuId,
        visible: testVisible
      };

      MenuAction.visibleItem(testMenuId, testVisible);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(MenuAction.Types.MENU_VISIBLE);
      expect(action.data).to.be.deep.eql(data);
    });

    it('dispatch is called with the right info for visible=false', function() {
      const testMenuId = 'menu1';
      const testVisible = false;
      const data = {
        id: testMenuId,
        visible: testVisible
      };

      MenuAction.visibleItem(testMenuId, testVisible);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(MenuAction.Types.MENU_VISIBLE);
      expect(action.data).to.be.deep.eql(data);
    });
  });
});
