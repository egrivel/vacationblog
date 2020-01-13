
const expect = require('chai').expect;
import sinon from 'sinon';

import utils from '../../src/actions/utils';

describe('actions/utils', () => {
  let xhr;
  let requests;
  let callback;
  let testUrl;
  let testResponse;

  beforeEach(() => {
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

  afterEach(() => {
    xhr.restore();
  });

  describe('#getAsync', () => {
    // To be implemented when I figure out how
    it('invokes the URL', () => {
      utils.getAsync(testUrl, callback);
      expect(requests.length).to.be.equal(1);
      expect(requests[0].url).to.be.equal(testUrl);
    });

    it('invokes the callback on success', () => {
      utils.getAsync(testUrl, callback);
      expect(requests.length).to.be.equal(1);
      requests[0].respond(200,
        {'Content-Type': 'text/plain'},
        testResponse);
      expect(callback.callCount).to.be.equal(1);
      expect(callback.firstCall.args[0]).to.be.equal(testResponse);
    });

    it('does not invoke the callback on failure', () => {
      utils.getAsync(testUrl, callback);
      expect(requests.length).to.be.equal(1);
      requests[0].respond(500,
        {'Content-Type': 'text/plain'},
        testResponse);
      expect(callback.callCount).to.be.equal(0);
    });
  });

  describe('#postAsync', () => {
    let testData;

    beforeEach(() => {
      testData = {
        field1: 'value 1',
        field2: 'value 1'
      };
    });

    it('invokes the URL', () => {
      utils.postAsync(testUrl, testData, callback);
      expect(requests.length).to.be.equal(1);
      expect(requests[0].url).to.be.equal(testUrl);
    });

    it('invokes the callback on success', () => {
      utils.postAsync(testUrl, testData, callback);
      expect(requests.length).to.be.equal(1);
      requests[0].respond(200,
        {'Content-Type': 'text/plain'},
        testResponse);
      expect(callback.callCount).to.be.equal(1);
      expect(callback.firstCall.args[0]).to.be.equal(testResponse);
    });

    it('does not invoke the callback on failure', () => {
      utils.postAsync(testUrl, testData, callback);
      expect(requests.length).to.be.equal(1);
      requests[0].respond(500,
        {'Content-Type': 'text/plain'},
        testResponse);
      expect(callback.callCount).to.be.equal(0);
    });
  });
});
