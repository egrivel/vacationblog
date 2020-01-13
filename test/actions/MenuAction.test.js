
const expect = require('chai').expect;
import sinon from 'sinon';

import AppDispatcher from '../../src/AppDispatcher';
import MenuAction from '../../src/actions/MenuAction';

describe('actions/MenuAction', () => {
  let dispatchStub;
  beforeEach(() => {
    dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
  });

  afterEach(() => {
    dispatchStub.restore();
  });

  describe('#selectItem', () => {
    it('dispatch is called with the right info', () => {
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

  describe('#visibleItem', () => {
    it('dispatch is called with the right info for visible=true', () => {
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

    it('dispatch is called with the right info for visible=false', () => {
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
