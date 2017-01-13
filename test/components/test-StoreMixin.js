'use strict';

// -----
// This test file is mostly to achieve code coverage.
// It doesn't really test all that much.
// -----

const expect = require('chai').expect;
const sinon = require('sinon');

const storeMixin = require('../../src/components/StoreMixin');

describe('components/StoreMixin', function() {
  let Mixin;
  let stub;

  beforeEach(function() {
    Mixin = storeMixin();
    stub = sinon.stub();
    const stores = [
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
