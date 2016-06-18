'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var UserActionTypes = require('../../src/actions/UserAction').Types;
var UserStore = require('../../src/stores/UserStore');

var testUserId1 = 'test-user-1';
var testUserId2 = 'test-user-2';

var testUser1 = {
  userId: testUserId1,
  name: 'Test User 1',
  property: 'test prop 1'
};
var testUser2 = {
  userId: testUserId2,
  name: 'Test User 2',
  property: 'test prop 2'
};

describe('stores/UserStore', function() {
  beforeEach(function() {
    UserStore.removeAllListeners();
    UserStore._reset();
  });

  afterEach(function() {
    UserStore.removeAllListeners();
  });

  // Behavior of an uninitialized user store
  describe('without users loaded', function() {
    describe('#getData', function() {
      it('returns undefined when uninitialized', function() {
        expect(UserStore.getData()).to.equal(undefined);
      });
    });
  });

  describe('with test user loaded', function() {
    var cb;

    var userAction1 = {
      type: UserActionTypes.USER_SET_DATA,
      data: testUser1
    };
    var userAction2 = {
      type: UserActionTypes.USER_SET_DATA,
      data: testUser2
    };
    var randomAction = {
      type: 'foo',
      data: testUser1
    };

    beforeEach(function() {
      cb = sinon.spy();
      UserStore.addChangeListener(cb);
    });

    afterEach(function() {
      UserStore.removeChangeListener(cb);
    });

    it('Loaded user data is returned', function() {
      UserStore._storeCallback(userAction1);
      expect(UserStore.getData(testUserId1)).to.deep.eql(testUser1);
    });

    it('Other than loaded user is undefined', function() {
      UserStore._storeCallback(userAction1);
      expect(UserStore.getData(testUserId2)).to.equal(undefined);
    });

    it('Multiple users are kept separate', function() {
      UserStore._storeCallback(userAction1);
      UserStore._storeCallback(userAction2);
      expect(UserStore.getData(testUserId1)).to.deep.eql(testUser1);
      expect(UserStore.getData(testUserId2)).to.deep.eql(testUser2);
    });

    it('Loading user for the first time emits change', function() {
      expect(cb.callCount).to.be.equal(0);
      UserStore._storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
    });

    it('Re-loading user does not emit change', function() {
      expect(cb.callCount).to.be.equal(0);
      UserStore._storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
      UserStore._storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
    });

    it('Loading second user emits change', function() {
      expect(cb.callCount).to.be.equal(0);
      UserStore._storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
      UserStore._storeCallback(userAction2);
      expect(cb.callCount).to.be.equal(2);
    });

    it('Random action does not emit change', function() {
      expect(cb.callCount).to.be.equal(0);
      UserStore._storeCallback(randomAction);
      expect(cb.callCount).to.be.equal(0);
    });
  });
});
