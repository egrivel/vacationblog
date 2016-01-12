'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');

var UserActionTypes = require('../../src/actions/UserAction').Types;

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

describe('UserStore', function() {
  // Always have the user store available
  beforeEach(function() {
    this.UserStore = rewire('../../src/stores/UserStore');
    this.storeCallback = this.UserStore.__get__('storeCallback');
  });

  // Behavior of an uninitialized user store
  describe('without users loaded', function() {
    describe('#getData', function() {
      it('returns undefined when uninitialized', function() {
        expect(this.UserStore.getData()).to.equal(undefined);
      });
    });
  });

  describe('with test user loaded', function() {
    var cb;

    var userAction1 = {
      type: UserActionTypes.USER_DATA,
      data: testUser1
    };
    var userAction2 = {
      type: UserActionTypes.USER_DATA,
      data: testUser2
    };
    var randomAction = {
      type: 'foo',
      data: testUser1
    };

    beforeEach(function() {
      cb = sinon.spy();
      this.UserStore.addChangeListener(cb);
    });

    afterEach(function() {
      this.UserStore.removeChangeListener(cb);
    });

    it('Loaded user data is returned', function() {
      this.storeCallback(userAction1);
      expect(this.UserStore.getData(testUserId1)).to.deep.eql(testUser1);
    });

    it('Other than loaded user is undefined', function() {
      this.storeCallback(userAction1);
      expect(this.UserStore.getData(testUserId2)).to.equal(undefined);
    });

    it('Multiple users are kept separate', function() {
      this.storeCallback(userAction1);
      this.storeCallback(userAction2);
      expect(this.UserStore.getData(testUserId1)).to.deep.eql(testUser1);
      expect(this.UserStore.getData(testUserId2)).to.deep.eql(testUser2);
    });

    it('Loading user for the first time emits change', function() {
      expect(cb.callCount).to.be.equal(0);
      this.storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
    });

    it('Re-loading user does not emit change', function() {
      expect(cb.callCount).to.be.equal(0);
      this.storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
      this.storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
    });

    it('Loading second user emits change', function() {
      expect(cb.callCount).to.be.equal(0);
      this.storeCallback(userAction1);
      expect(cb.callCount).to.be.equal(1);
      this.storeCallback(userAction2);
      expect(cb.callCount).to.be.equal(2);
    });

    it('Random action does not emit change', function() {
      expect(cb.callCount).to.be.equal(0);
      this.storeCallback(randomAction);
      expect(cb.callCount).to.be.equal(0);
    });
  });
});
