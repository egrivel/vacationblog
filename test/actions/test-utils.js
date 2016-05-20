'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var utils = require('../../src/actions/utils');

describe('action utils', function() {
  var xhr;
  var requests;
  var callback;
  var testUrl;
  var testResponse;

  beforeEach(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    global.XMLHttpRequest = xhr;
    requests = [];
    xhr.onCreate = function(xhr) {
      requests.push(xhr);
    };
    callback = sinon.stub();
    testUrl = 'http://fake.url/test';
    testResponse = 'this is the test response';
  });

  afterEach(function() {
    xhr.restore();
  });

  describe('#getAsync', function() {
    // To be implemented when I figure out how
    it('invokes the URL', function() {
      utils.getAsync(testUrl, callback);
      expect(requests.length).to.be.equal(1);
      expect(requests[0].url).to.be.equal(testUrl);
    });

    it('invokes the callback on success', function() {
      utils.getAsync(testUrl, callback);
      expect(requests.length).to.be.equal(1);
      requests[0].respond(200,
                          {'Content-Type': 'text/plain'},
                          testResponse);
      expect(callback.callCount).to.be.equal(1);
      expect(callback.firstCall.args[0]).to.be.equal(testResponse);
    });

    it('does not invoke the callback on failure', function() {
      utils.getAsync(testUrl, callback);
      expect(requests.length).to.be.equal(1);
      requests[0].respond(500,
                          {'Content-Type': 'text/plain'},
                          testResponse);
      expect(callback.callCount).to.be.equal(0);
    });
  });

  describe('#postAsync', function() {
    // TODO: add tests for the data being properly posted
    var testData;

    beforeEach(function() {
      testData = {
        field1: 'value 1',
        field2: 'value 1'
      };
    });

    it('invokes the URL', function() {
      utils.postAsync(testUrl, testData, callback);
      expect(requests.length).to.be.equal(1);
      expect(requests[0].url).to.be.equal(testUrl);
    });

    it('invokes the callback on success', function() {
      utils.postAsync(testUrl, testData, callback);
      expect(requests.length).to.be.equal(1);
      requests[0].respond(200,
                          {'Content-Type': 'text/plain'},
                          testResponse);
      expect(callback.callCount).to.be.equal(1);
      expect(callback.firstCall.args[0]).to.be.equal(testResponse);
    });

    it('does not invoke the callback on failure', function() {
      utils.postAsync(testUrl, testData, callback);
      expect(requests.length).to.be.equal(1);
      requests[0].respond(500,
                          {'Content-Type': 'text/plain'},
                          testResponse);
      expect(callback.callCount).to.be.equal(0);
    });
  });
});
