'use strict';

// -----
// This test file is mostly to achieve code coverage.
// It doesn't really test all that much.
// -----

var expect = require('chai').expect;
var sinon = require('sinon');

var storeMixin = require('../../src/components/StoreMixin');

describe('components/StoreMixin', function() {
  var Mixin;
  var stub;

  beforeEach(function() {
    Mixin = storeMixin();
    stub = sinon.stub();
    var stores = [
      {
        addChangeListener: stub,
        removeChangeListener: stub
      }
    ];
    Mixin.stores = stores;
    Mixin.setState = stub;
    Mixin._getStateFromStores = stub;
  });

  afterEach(function() {
    // stub.restore();
  });

  it('#componentDidMount', function() {
    Mixin.componentDidMount();
    expect(stub.callCount).to.be.equal(1);
  });

  it('#componentWillUnmount', function() {
    Mixin.componentWillUnmount();
    expect(stub.callCount).to.be.equal(1);
  });

  it('#_onChange', function() {
    Mixin._onChange();
    expect(stub.callCount).to.be.equal(2);
  });
});
