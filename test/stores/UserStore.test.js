
const expect = require('chai').expect;
import sinon from 'sinon';

import UserActionTypes from '../../src/actions/UserActionTypes';
import UserStore from '../../src/stores/UserStore';

const testUserId1 = 'test-user-1';
const testUserId2 = 'test-user-2';

const testUser1 = {
  userId: testUserId1,
  name: 'Test User 1',
  property: 'test prop 1'
};
const testUser2 = {
  userId: testUserId2,
  name: 'Test User 2',
  property: 'test prop 2'
};

describe('stores/UserStore', () => {
  beforeEach(() => {
    UserStore.removeAllListeners();
    UserStore._reset();
  });

  afterEach(() => {
    UserStore.removeAllListeners();
  });

  // Behavior of an uninitialized user store
  describe('without users loaded', () => {
    describe('#getData', () => {
      it('returns undefined when uninitialized', () => {
        expect(UserStore.getData()).to.equal(undefined);
      });
    });
  });

  describe('with test user loaded', () => {
    let cb;

    const userAction1 = {
      type: UserActionTypes.USER_SET_DATA,
      data: testUser1
    };
    const userAction2 = {
      type: UserActionTypes.USER_SET_DATA,
      data: testUser2
    };
    const randomAction = {
      type: 'foo',
      data: testUser1
    };

    beforeEach(() => {
      cb = sinon.spy();
      UserStore.addChangeListener(cb);
    });

    afterEach(() => {
      UserStore.removeChangeListener(cb);
    });

    it('Loaded user data is returned', () => {
      UserStore._storeCallback(userAction1);
      expect(UserStore.getData(testUserId1)).to.deep.eql(testUser1);
    });

    it('Other than loaded user is undefined', () => {
      UserStore._storeCallback(userAction1);
      expect(UserStore.getData(testUserId2)).to.equal(undefined);
    });

    it('Multiple users are kept separate', () => {
      UserStore._storeCallback(userAction1);
      UserStore._storeCallback(userAction2);
      expect(UserStore.getData(testUserId1)).to.deep.eql(testUser1);
      expect(UserStore.getData(testUserId2)).to.deep.eql(testUser2);
    });

    it('Loading user for the first time emits change', () => {
      expect(cb.callCount).to.be.equal(0);
      UserStore._storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
    });

    it('Re-loading user does not emit change', () => {
      expect(cb.callCount).to.be.equal(0);
      UserStore._storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
      UserStore._storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
    });

    it('Loading second user emits change', () => {
      expect(cb.callCount).to.be.equal(0);
      UserStore._storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
      UserStore._storeCallback(userAction2);
      expect(cb.callCount).to.be.equal(2);
    });

    it('Random action does not emit change', () => {
      expect(cb.callCount).to.be.equal(0);
      UserStore._storeCallback(randomAction);
      expect(cb.callCount).to.be.equal(0);
    });
  });
});
