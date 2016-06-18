'use strict';

// use the global 'document' for cookies testing
/* global document */

var expect = require('chai').expect;
var sinon = require('sinon');

var utils = require('../../src/actions/utils');
var LoginAction = require('../../src/actions/LoginAction');
var UserAction = require('../../src/actions/UserAction');

describe('actions/LoginAction', function() {
  var asyncPostStub;
  var setLoggedInUserStub;
  var loadUserStub;

  var testUserId;
  var testPassword;

  beforeEach(function() {
    testUserId = 'test-user';
    testPassword = 'testPassword';

    asyncPostStub = sinon.stub(utils, 'postAsync',
      function(url, data, cb) {
        cb();
      });
    setLoggedInUserStub = sinon.stub(UserAction, 'setLoggedInUser');
    loadUserStub = sinon.stub(UserAction, 'loadUser');
  });

  afterEach(function() {
    loadUserStub.restore();
    setLoggedInUserStub.restore();
    asyncPostStub.restore();
  });

  describe('#doLogin', function() {
    var doLoginCallbackStub;

    beforeEach(function() {
      doLoginCallbackStub = sinon.stub(LoginAction, '_doLoginCallback');
    });

    afterEach(function() {
      doLoginCallbackStub.restore();
    });

    it('sets login user ID', function() {
      if (LoginAction.loginUserId) {
        delete LoginAction.loginUserId;
      }
      LoginAction.doLogin(testUserId, testPassword);
      expect(LoginAction.loginUserId).to.exist;
      expect(LoginAction.loginUserId).to.be.equal(testUserId);
    });

    it('posts data', function() {
      LoginAction.doLogin(testUserId, testPassword);
      expect(asyncPostStub.callCount).to.be.equal(1);
    });

    it('calls right URL', function() {
      LoginAction.doLogin(testUserId, testPassword);
      expect(asyncPostStub.callCount).to.be.equal(1);
      expect(asyncPostStub.args[0].length).to.be.equal(3);
      expect(asyncPostStub.args[0][0]).to.be.equal('api/login.php');
    });

    it('passes user ID', function() {
      LoginAction.doLogin(testUserId, testPassword);
      expect(asyncPostStub.callCount).to.be.equal(1);
      expect(asyncPostStub.args[0].length).to.be.equal(3);
      expect(asyncPostStub.args[0][1].userId).to.exist;
      expect(asyncPostStub.args[0][1].userId).to.be.equal(testUserId);
    });

    it('passes password', function() {
      LoginAction.doLogin(testUserId, testPassword);
      expect(asyncPostStub.callCount).to.be.equal(1);
      expect(asyncPostStub.args[0].length).to.be.equal(3);
      expect(asyncPostStub.args[0][1].password).to.exist;
      expect(asyncPostStub.args[0][1].password).to.be.equal(testPassword);
    });

    it('calls callback', function() {
      LoginAction.doLogin(testUserId, testPassword);
      expect(doLoginCallbackStub.callCount).to.be.equal(1);
    });
  });

  describe('#_doLoginCallback', function() {
    var response;
    var testAuthId;

    beforeEach(function() {
      // erase all cookies... note that the only way to erase a cookie in
      // JavaScript is to set it to an expiration date in the past.
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var name = cookies[i].split("=")[0];
        document.cookie = name + '=; expires=' + new Date(0).toGMTString();
      }
      testAuthId = 'auth-ID';
      response = JSON.stringify({
        resultCode: '200',
        authId: testAuthId
      });
    });

    it('sets document cookie', function() {
      expect(document.cookie).to.be.equal('');
      LoginAction._doLoginCallback(response);
      expect(document.cookie).to.contain('blogAuthId');
      expect(document.cookie).to.contain(testAuthId);
    });

    it('calls setLoggedInUser when user ID is set', function() {
      expect(document.cookie).to.be.equal('');
      LoginAction.loginUserId = testUserId;
      LoginAction._doLoginCallback(response);
      expect(setLoggedInUserStub.callCount).to.be.equal(1);
    });

    it('calls setLoggedInUser with user ID', function() {
      LoginAction.loginUserId = testUserId;
      LoginAction._doLoginCallback(response);
      expect(setLoggedInUserStub.callCount).to.be.equal(1);
      expect(setLoggedInUserStub.args[0].length).to.be.equal(1);
      expect(setLoggedInUserStub.args[0][0]).to.be.equal(testUserId);
    });

    it('blanks out setLoggedInUser without user ID', function() {
      if (LoginAction.loginUserId) {
        delete LoginAction.loginUserId;
      }
      // If there is no user ID when the callback gets executed, it will
      // explicitly set the logged in user to a blank string
      LoginAction._doLoginCallback(response);
      expect(setLoggedInUserStub.callCount).to.be.equal(1);
      expect(setLoggedInUserStub.args[0].length).to.be.equal(1);
      expect(setLoggedInUserStub.args[0][0]).to.be.equal('');
    });

    it('calls loadUser when user ID is set', function() {
      LoginAction.loginUserId = testUserId;
      LoginAction._doLoginCallback(response);
      expect(loadUserStub.callCount).to.be.equal(1);
    });

    it('calls loadUser with user ID', function() {
      LoginAction.loginUserId = testUserId;
      LoginAction._doLoginCallback(response);
      expect(loadUserStub.callCount).to.be.equal(1);
      expect(loadUserStub.args[0].length).to.be.equal(1);
      expect(loadUserStub.args[0][0]).to.be.equal(testUserId);
    });

    it('does not call loadUser without user ID', function() {
      if (LoginAction.loginUserId) {
        delete LoginAction.loginUserId;
      }
      LoginAction._doLoginCallback(response);
      expect(loadUserStub.callCount).to.be.equal(0);
    });

    it('error result does not do anything', function() {
      response = JSON.stringify({
        resultCode: '404',
        authId: testAuthId
      });
      LoginAction.loginUserId = testUserId;
      expect(document.cookie).to.be.equal('', 'before');
      LoginAction._doLoginCallback(response);
      expect(document.cookie).to.be.equal('', 'after');
      expect(setLoggedInUserStub.callCount).to.be.equal(0);
      expect(loadUserStub.callCount).to.be.equal(0);
    });

    it('response without authId blanks cookie', function() {
      response = JSON.stringify({
        resultCode: '200'
      });
      LoginAction.loginUserId = testUserId;
      expect(document.cookie).to.be.equal('', 'before');
      LoginAction._doLoginCallback(response);
      expect(document.cookie).to.be.equal('blogAuthId=', 'after');
      expect(setLoggedInUserStub.callCount).to.be.equal(1);
      expect(loadUserStub.callCount).to.be.equal(1);
    });
  });
});
