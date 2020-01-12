'use strict';

const expect = require('chai').expect;
import sinon from 'sinon';

import utils from '../../src/actions/utils';
import AppDispatcher from '../../src/AppDispatcher';
import UserAction from '../../src/actions/UserAction';

describe('actions/UserAction', function() {
  describe('#loadUser', function() {
    const testUserId = 'user-1';
    let asyncStub;
    let userLoadedStub;
    const testData = {
      userId: testUserId,
      data: 'more data'
    };

    beforeEach(function() {
      userLoadedStub = sinon.stub(UserAction, '_userLoaded');
      asyncStub = sinon.stub(utils, 'getAsync', function(url, callback) {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(function() {
      asyncStub.restore();
      userLoadedStub.restore();
    });

    it('calls API with user ID', function() {
      UserAction.loadUser(testUserId);

      expect(asyncStub.args.length).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.be.equal('api/getUser.php?userId=' +
                                               testUserId);
    });

    it('calls _userLoaded with data', function() {
      UserAction.loadUser(testUserId);

      expect(userLoadedStub.args.length).to.be.equal(1);
      expect(userLoadedStub.args[0].length).to.be.equal(1);
      expect(userLoadedStub.args[0][0]).to.be.deep.eql(testData);
    });
  });

  describe('#_userLoaded', function() {
    let dispatchStub;

    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(function() {
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      const data = {
        data: 'some data'
      };
      UserAction._userLoaded(data);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(UserAction.Types.USER_SET_DATA);
      expect(action.data).to.be.deep.eql(data);
    });
  });

  describe('#setLoggedInUser', function() {
    let dispatchStub;

    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(function() {
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      const testUserId = 'test-user';
      UserAction.setLoggedInUser(testUserId);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(UserAction.Types.USER_SET_LOGGED_IN);
      expect(action.userId).to.be.equal(testUserId);
    });
  });
});
