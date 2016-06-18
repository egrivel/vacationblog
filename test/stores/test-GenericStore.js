'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var GenericStore = require('../../src/stores/GenericStore');

describe('stores/GenericStore', function() {
  beforeEach(function() {
    GenericStore.removeAllListeners();
  });

  it('registered change listener gets called', function() {
    var cb = sinon.spy();

    GenericStore.addChangeListener(cb);
    expect(cb.callCount).to.be.equal(0);

    GenericStore.emitChange();
    expect(cb.callCount).to.be.equal(1);

    GenericStore.removeChangeListener(cb);
  });

  it('removed change listener does not get called', function() {
    var cb = sinon.spy();

    // Register a change listener and make sure it is getting called
    GenericStore.addChangeListener(cb);
    expect(cb.callCount).to.be.equal(0);

    GenericStore.emitChange();
    expect(cb.callCount).to.be.equal(1);

    // Remove the change listener, emit another change and make sure the
    // removed change listener no longer is getting called.
    GenericStore.removeChangeListener(cb);
    GenericStore.emitChange();
    expect(cb.callCount).to.be.equal(1);
  });

  it('multiple change listeners all get called', function() {
    var cb1 = sinon.spy();
    var cb2 = sinon.spy();
    var cb3 = sinon.spy();

    // Register a change listener and make sure it is getting called
    GenericStore.addChangeListener(cb1);
    expect(cb1.callCount).to.be.equal(0);

    GenericStore.emitChange();
    expect(cb1.callCount).to.be.equal(1);
    expect(cb2.callCount).to.be.equal(0);

    GenericStore.addChangeListener(cb2);
    GenericStore.emitChange();
    expect(cb1.callCount).to.be.equal(2);
    expect(cb2.callCount).to.be.equal(1);
    expect(cb3.callCount).to.be.equal(0);

    GenericStore.addChangeListener(cb3);
    GenericStore.emitChange();
    expect(cb1.callCount).to.be.equal(3);
    expect(cb2.callCount).to.be.equal(2);
    expect(cb3.callCount).to.be.equal(1);

    GenericStore.removeChangeListener(cb2);
    GenericStore.emitChange();
    expect(cb1.callCount).to.be.equal(4);
    expect(cb2.callCount).to.be.equal(2);
    expect(cb3.callCount).to.be.equal(2);
  });
});
