'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');

describe('GenericStore', function() {
  beforeEach(function() {
    this.GenericStore = rewire('../../src/stores/GenericStore');
  });

  it('registered change listener gets called', function() {
    var cb = sinon.spy();

    this.GenericStore.addChangeListener(cb);
    expect(cb.callCount).to.be.equal(0);

    this.GenericStore.emitChange();
    expect(cb.callCount).to.be.equal(1);

    this.GenericStore.removeChangeListener(cb);
  });

  it('removed change listener does not get called', function() {
    var cb = sinon.spy();

    // Register a change listener and make sure it is getting called
    this.GenericStore.addChangeListener(cb);
    expect(cb.callCount).to.be.equal(0);

    this.GenericStore.emitChange();
    expect(cb.callCount).to.be.equal(1);

    // Remove the change listener, emit another change and make sure the
    // removed change listener no longer is getting called.
    this.GenericStore.removeChangeListener(cb);
    this.GenericStore.emitChange();
    expect(cb.callCount).to.be.equal(1);
  });

  it('multiple change listeners all get called', function() {
    var cb1 = sinon.spy();
    var cb2 = sinon.spy();
    var cb3 = sinon.spy();

    // Register a change listener and make sure it is getting called
    this.GenericStore.addChangeListener(cb1);
    expect(cb1.callCount).to.be.equal(0);

    this.GenericStore.emitChange();
    expect(cb1.callCount).to.be.equal(1);
    expect(cb2.callCount).to.be.equal(0);

    this.GenericStore.addChangeListener(cb2);
    this.GenericStore.emitChange();
    expect(cb1.callCount).to.be.equal(2);
    expect(cb2.callCount).to.be.equal(1);
    expect(cb3.callCount).to.be.equal(0);

    this.GenericStore.addChangeListener(cb3);
    this.GenericStore.emitChange();
    expect(cb1.callCount).to.be.equal(3);
    expect(cb2.callCount).to.be.equal(2);
    expect(cb3.callCount).to.be.equal(1);

    this.GenericStore.removeChangeListener(cb2);
    this.GenericStore.emitChange();
    expect(cb1.callCount).to.be.equal(4);
    expect(cb2.callCount).to.be.equal(2);
    expect(cb3.callCount).to.be.equal(2);
  });
});
