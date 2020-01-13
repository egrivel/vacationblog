const expect = require('chai').expect;
import sinon from 'sinon';

import utils from '../../src/actions/utils';
import LoginAction from '../../src/actions/LoginAction';
import UserAction from '../../src/actions/UserAction';

describe('actions/LoginAction', () => {
  let asyncPostStub;
  let setLoggedInUserStub;
  let loadUserStub;

  let testUserId;
  let testPassword;

  beforeEach(() => {
    testUserId = 'test-user';
    testPassword = 'testPassword';

    asyncPostStub = sinon.stub(utils, 'postAsync').callsFake(
      (url, data, cb) => {
        cb();
      });
    setLoggedInUserStub = sinon.stub(UserAction, 'setLoggedInUser');
    loadUserStub = sinon.stub(UserAction, 'loadUser');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#doLogin', () => {
    let doLoginCallbackStub;

    beforeEach(() => {
      doLoginCallbackStub = sinon.stub(LoginAction, '_doLoginCallback');
    });

    afterEach(() => {
      doLoginCallbackStub.restore();
    });

    it('sets login user ID', () => {
      if (LoginAction.userId) {
        delete LoginAction.userId;
      }
      LoginAction.doLogin(testUserId, testPassword);
      expect(LoginAction.userId).to.exist;
      expect(LoginAction.userId).to.be.equal(testUserId);
    });

    it('posts data', () => {
      LoginAction.doLogin(testUserId, testPassword);
      expect(asyncPostStub.callCount).to.be.equal(1);
    });

    it('calls right URL', () => {
      LoginAction.doLogin(testUserId, testPassword);
      expect(asyncPostStub.callCount).to.be.equal(1);
      expect(asyncPostStub.args[0].length).to.be.equal(3);
      expect(asyncPostStub.args[0][0]).to.be.equal('api/login.php');
    });

    it('passes user ID', () => {
      LoginAction.doLogin(testUserId, testPassword);
      expect(asyncPostStub.callCount).to.be.equal(1);
      expect(asyncPostStub.args[0].length).to.be.equal(3);
      expect(asyncPostStub.args[0][1].userId).to.exist;
      expect(asyncPostStub.args[0][1].userId).to.be.equal(testUserId);
    });

    it('passes password', () => {
      LoginAction.doLogin(testUserId, testPassword);
      expect(asyncPostStub.callCount).to.be.equal(1);
      expect(asyncPostStub.args[0].length).to.be.equal(3);
      expect(asyncPostStub.args[0][1].password).to.exist;
      expect(asyncPostStub.args[0][1].password).to.be.equal(testPassword);
    });

    it('calls callback', () => {
      LoginAction.doLogin(testUserId, testPassword);
      expect(doLoginCallbackStub.callCount).to.be.equal(1);
    });
  });

  describe('#_doLoginCallback', () => {
    let response;
    let responseNoUserId;
    let testAuthId;

    beforeEach(() => {
      // erase all cookies... note that the only way to erase a cookie in
      // JavaScript is to set it to an expiration date in the past.
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const name = cookies[i].split('=')[0];
        document.cookie = name + '=; expires=' + new Date(0).toGMTString();
      }
      testAuthId = 'auth-ID';
      response = JSON.stringify({
        authId: testAuthId,
        resultCode: '200',
        userId: testUserId
      });
      // Not even sure what this would mean?
      responseNoUserId = JSON.stringify({
        authId: testAuthId,
        resultCode: '200'
      });
    });

    it('sets document cookie', () => {
      expect(document.cookie).to.be.equal('');
      LoginAction._doLoginCallback(response);
      expect(document.cookie).to.contain('blogAuthId');
      expect(document.cookie).to.contain(testAuthId);
    });

    it('calls setLoggedInUser when user ID is set', () => {
      expect(document.cookie).to.be.equal('');
      LoginAction.userId = testUserId;
      LoginAction._doLoginCallback(response);
      expect(setLoggedInUserStub.callCount).to.be.equal(1);
    });

    it('calls setLoggedInUser with user ID', () => {
      LoginAction.userId = testUserId;
      LoginAction._doLoginCallback(response);
      expect(setLoggedInUserStub.callCount).to.be.equal(1);
      expect(setLoggedInUserStub.args[0].length).to.be.equal(1);
      expect(setLoggedInUserStub.args[0][0]).to.be.equal(testUserId);
    });

    it('blanks out setLoggedInUser without user ID', () => {
      if (LoginAction.userId) {
        delete LoginAction.userId;
      }
      // If there is no user ID when the callback gets executed, it will
      // explicitly set the logged in user to a blank string
      LoginAction._doLoginCallback(responseNoUserId);
      expect(setLoggedInUserStub.callCount).to.be.equal(1);
      expect(setLoggedInUserStub.args[0].length).to.be.equal(1);
      expect(setLoggedInUserStub.args[0][0]).to.be.equal('');
    });

    it('calls loadUser when user ID is set', () => {
      LoginAction.userId = testUserId;
      LoginAction._doLoginCallback(response);
      expect(loadUserStub.callCount).to.be.equal(1);
    });

    it('calls loadUser with user ID', () => {
      LoginAction.userId = testUserId;
      LoginAction._doLoginCallback(response);
      expect(loadUserStub.callCount).to.be.equal(1);
      expect(loadUserStub.args[0].length).to.be.equal(1);
      expect(loadUserStub.args[0][0]).to.be.equal(testUserId);
    });

    it('does not call loadUser without user ID', () => {
      if (LoginAction.userId) {
        delete LoginAction.userId;
      }
      LoginAction._doLoginCallback(responseNoUserId);
      expect(loadUserStub.callCount).to.be.equal(0);
    });

    it('error result does not do anything', () => {
      response = JSON.stringify({
        resultCode: '404',
        authId: testAuthId
      });
      LoginAction.userId = testUserId;
      expect(document.cookie).to.be.equal('', 'before');
      LoginAction._doLoginCallback(response);
      expect(document.cookie).to.be.equal('', 'after');
      expect(setLoggedInUserStub.callCount).to.be.equal(0);
      expect(loadUserStub.callCount).to.be.equal(0);
    });

    it('response without authId blanks cookie', () => {
      // Set up the test by making sure a cookie is set first
      LoginAction._doLoginCallback(response);
      expect(document.cookie).to.contain('blogAuthId', 'before');
      expect(setLoggedInUserStub.callCount).to.be.equal(1);

      response = JSON.stringify({
        resultCode: '200'
      });
      LoginAction.userId = testUserId;
      LoginAction._doLoginCallback(response);
      expect(document.cookie).to.not.contain('blogAuthId', 'after');
      expect(setLoggedInUserStub.callCount).to.be.equal(2);
      expect(loadUserStub.callCount).to.be.equal(1);
    });
  });
});
