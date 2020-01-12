'use strict';

const expect = require('chai').expect;
import sinon from 'sinon';

import MenuStore from '../../src/stores/MenuStore';
import MenuActionTypes from '../../src/actions/MenuActionTypes';
import TripActionTypes from '../../src/actions/TripActionTypes';

describe('stores/MenuStore', function() {
  beforeEach(function() {
    MenuStore.removeAllListeners();
  });

  afterEach(function() {
    MenuStore.removeAllListeners();
  });

  describe('without trips loaded', function() {
    describe('#getData', function() {
      it('returns Home top-level item', function() {
        const data = MenuStore.getData();

        expect(data.length).to.be.at.least(1);
        expect(data[0].id).to.exist;
        expect(data[0].id).to.not.equal('');
        expect(data[0].label).to.equal('Home');
        expect(data[0].selected).to.equal(false);
        expect(data[0].target).to.equal('#/');
        expect(data[0].submenu).to.not.exist;
      });

      it('returns Trip top-level item', function() {
        const data = MenuStore.getData();

        expect(data.length).to.be.at.least(2);
        expect(data[1].id).to.exist;
        expect(data[1].id).to.not.equal('');
        expect(data[1].label).to.equal('Trip');
        expect(data[1].selected).to.equal(false);
        expect(data[1].target).to.equal('#/trip');
        expect(data[1].submenu).to.not.exist;
      });

      it('returns Search top-level item', function() {
        const data = MenuStore.getData();

        expect(data.length).to.be.at.least(3);
        expect(data[2].id).to.exist;
        expect(data[2].id).to.not.equal('');
        expect(data[2].label).to.equal('Search');
        expect(data[2].selected).to.equal(false);
        expect(data[2].target).to.equal('#/search');
        expect(data[2].submenu).to.not.exist;
      });

      it('returns Preferences (1) top-level item', function() {
        const data = MenuStore.getData();

        expect(data.length).to.be.at.least(4);
        expect(data[3].id).to.exist;
        expect(data[3].id).to.not.equal('');
        expect(data[3].label).to.equal('Preferences');
        expect(data[3].selected).to.equal(false);
        expect(data[3].target).to.equal('#/prefs');
        expect(data[3].submenu).to.not.exist;
      });

      it('returns Admin top-level item', function() {
        const data = MenuStore.getData();

        expect(data.length).to.be.at.least(5);
        expect(data[4].id).to.exist;
        expect(data[4].id).to.not.equal('');
        expect(data[4].label).to.equal('Admin');
        expect(data[4].selected).to.equal(false);
        expect(data[4].target).to.equal('#/admin');
        expect(data[4].submenu).to.not.exist;
      });

      it('returns About top-level item', function() {
        const data = MenuStore.getData();

        expect(data.length).to.be.at.least(6);
        expect(data[5].id).to.exist;
        expect(data[5].id).to.not.equal('');
        expect(data[5].label).to.equal('About');
        expect(data[5].selected).to.equal(false);
        expect(data[5].target).to.equal('#/about');
        expect(data[5].submenu).to.not.exist;
      });
    });

    describe('select action', function() {
      it('selects indicated item', function() {
        let data = MenuStore.getData();
        const id = data[0].id;

        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_SELECT,
          data: {id: id}
        });

        data = MenuStore.getData();
        expect(data[0].selected).to.equal(true);
      });

      it('deselects previously selected item', function() {
        let data = MenuStore.getData();
        const id1 = data[0].id;
        const id2 = data[1].id;

        // select the first menu item and make sure it is 'selected'
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_SELECT,
          data: {id: id1}
        });
        data = MenuStore.getData();
        expect(data[0].selected).to.equal(true);

        // select the second menu item and make sure the first item is
        // no longer 'selected'
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_SELECT,
          data: {id: id2}
        });

        data = MenuStore.getData();
        expect(data[0].selected).to.equal(false);
      });

      it('selecting unselected item emits change', function() {
        const cb = sinon.spy();
        MenuStore.addChangeListener(cb);

        const data = MenuStore.getData();
        const id = data[0].id;

        expect(cb.callCount).to.be.equal(0);
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_SELECT,
          data: {id: id}
        });
        expect(cb.callCount).to.be.equal(1);
        MenuStore.removeChangeListener(cb);
      });

      it('selecting selected item DOES emit change', function() {
        const cb = sinon.spy();
        MenuStore.addChangeListener(cb);

        const data = MenuStore.getData();
        const id = data[0].id;

        expect(cb.callCount).to.be.equal(0);

        // first time emits change
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_SELECT,
          data: {id: id}
        });
        expect(cb.callCount).to.be.equal(1);

        // second time emits change again
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_SELECT,
          data: {id: id}
        });
        expect(cb.callCount).to.be.equal(2);
      });
    });

    // making items visible has been commented out in the store
    describe.skip('visible action', function() {
      it('make visible indicated item', function() {
        let data = MenuStore.getData();
        const id = data[0].id;

        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_VISIBLE,
          data: {
            id: id,
            visible: true
          }
        });

        data = MenuStore.getData();
        expect(data[0].visible).to.equal(true);
      });

      it('make visible invisible item emits change', function() {
        const cb = sinon.stub();
        MenuStore.addChangeListener(cb);

        const data = MenuStore.getData();
        const id = data[0].id;

        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_VISIBLE,
          data: {
            id: id,
            visible: true
          }
        });
        expect(cb.callCount).to.be.equal(1);
        MenuStore.removeChangeListener(cb);
      });

      it('make visible visible item does not emit change', function() {
        const cb = sinon.stub();
        MenuStore.addChangeListener(cb);

        const data = MenuStore.getData();
        const id = data[0].id;

        // first time emits change
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_VISIBLE,
          data: {
            id: id,
            visible: true
          }
        });
        expect(cb.callCount).to.be.equal(1);

        // second time does not emit change
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_VISIBLE,
          data: {
            id: id,
            visible: true
          }
        });
        expect(cb.callCount).to.be.equal(2);
      });
    });
  });

  // The menu store doesn't listen to trip actions, this whole section
  // of tests probably needs to be re-designed
  describe.skip('load trips', function() {
    describe('without trip data', function() {
      beforeEach(function() {
        MenuStore._storeCallback({
          type: TripActionTypes.TRIP_LOAD_LIST,
          data: null
        });
      });

      it('Menu contains dummy trip', function() {
        const data = MenuStore.getData();

        // all four items on the top-level should still be there.
        expect(data.length).to.be.equal(4);
        expect(data[0].submenu).to.not.exist;
        expect(data[0].target).to.be.equal('#/trip');
      });
    });

    describe('with trip data', function() {
      const tripList = [
        {
          tripId: 'trip-1',
          name: 'Test Trip 1'
        },
        {
          tripId: 'trip-2',
          name: 'Test Trip 2'
        }
      ];
      beforeEach(function() {
        MenuStore._storeCallback({
          type: TripActionTypes.TRIP_LOAD_LIST,
          data: tripList
        });
      });

      it('Menu contains first trip', function() {
        const data = MenuStore.getData();

        expect(data.length).to.be.at.least(1);
        expect(data[0].submenu).to.exist;
        expect(data[0].submenu.length).to.be.at.least(1);
        expect(data[0].submenu[0].id).to.exist;
        expect(data[0].submenu[0].id).to.not.equal('');
        expect(data[0].submenu[0].label).to.exist;
        expect(data[0].submenu[0].label).to.equal(tripList[0].name);
        expect(data[0].submenu[0].selected).to.exist;
        expect(data[0].submenu[0].selected).to.equal(false);
        expect(data[0].submenu[0].target).to.exist;
        expect(data[0].submenu[0].target).to.equal('#/trip/' +
                                                   tripList[0].tripId);
      });

      it('Menu contains second trip', function() {
        const data = MenuStore.getData();

        expect(data.length).to.be.at.least(1);
        expect(data[0].submenu).to.exist;
        expect(data[0].submenu.length).to.be.at.least(2);
        expect(data[0].submenu[1].id).to.exist;
        expect(data[0].submenu[1].id).to.not.equal('');
        expect(data[0].submenu[1].label).to.exist;
        expect(data[0].submenu[1].label).to.equal(tripList[1].name);
        expect(data[0].submenu[1].selected).to.exist;
        expect(data[0].submenu[1].selected).to.equal(false);
        expect(data[0].submenu[1].target).to.exist;
        expect(data[0].submenu[1].target).to.equal('#/trip/' +
                                                   tripList[1].tripId);
      });

      it('selects indicated item', function() {
        let data = MenuStore.getData();

        // select the first trip
        let id = data[0].submenu[0].id;
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_SELECT,
          data: {id: id}
        });

        data = MenuStore.getData();
        expect(data[0].selected).to.equal(true);
        expect(data[0].submenu[0].selected).to.equal(true);
        expect(data[0].submenu[1].selected).to.equal(false);

        // select the second trip
        id = data[0].submenu[1].id;
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_SELECT,
          data: {id: id}
        });

        data = MenuStore.getData();
        expect(data[0].selected).to.equal(true);
        expect(data[0].submenu[0].selected).to.equal(false);
        expect(data[0].submenu[1].selected).to.equal(true);
      });

      it('select non-trip item', function() {
        let data = MenuStore.getData();

        // select the first trip
        const id = data[1].id;
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_SELECT,
          data: {id: id}
        });

        data = MenuStore.getData();
        expect(data[1].selected).to.equal(true);
      });

      it('make visible indicated item', function() {
        let data = MenuStore.getData();

        // select the first trip
        let id = data[0].submenu[0].id;
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_VISIBLE,
          data: {
            id: id,
            visible: true
          }
        });

        data = MenuStore.getData();
        expect(data[0].visible).to.equal(true);
        expect(data[0].submenu[0].visible).to.equal(true);
        expect(data[0].submenu[1].visible).to.equal(false);

        // select the second trip
        id = data[0].submenu[1].id;
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_VISIBLE,
          data: {
            id: id,
            visible: true
          }
        });

        data = MenuStore.getData();
        expect(data[0].visible).to.equal(true);
        expect(data[0].submenu[0].visible).to.equal(false);
        expect(data[0].submenu[1].visible).to.equal(true);
      });

      it('make visible non-trip item', function() {
        let data = MenuStore.getData();

        // select the first trip
        const id = data[1].id;
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_VISIBLE,
          data: {
            id: id,
            visible: true
          }
        });

        data = MenuStore.getData();
        expect(data[0].visible).to.equal(false);
        expect(data[1].visible).to.equal(true);
      });

      it('making visible item emits change', function() {
        const cb = sinon.spy();
        MenuStore.addChangeListener(cb);

        const data = MenuStore.getData();
        const id = data[0].id;

        expect(cb.callCount).to.be.equal(0);
        MenuStore._storeCallback({
          type: MenuActionTypes.MENU_VISIBLE,
          data: {
            id: id,
            visible: true
          }
        });
        expect(cb.callCount).to.be.equal(1);
        MenuStore.removeChangeListener(cb);
      });

      describe('removing trip data', function() {
        beforeEach(function() {
          MenuStore._storeCallback({
            type: TripActionTypes.TRIP_LOAD_LIST,
            data: null
          });
        });

        it('Menu contains dummy trip', function() {
          const data = MenuStore.getData();
          expect(JSON.stringify(data)).to.be.equal("");

          // all four items on the top-level should still be there.
          expect(data.length).to.be.equal(4);
          expect(data[0].submenu).to.not.exist;
          expect(data[0].target).to.be.equal('#/trip');
        });
      });
    });
  });

  it('random action does not emit change', function() {
    const cb = sinon.spy();
    MenuStore.addChangeListener(cb);

    const data = MenuStore.getData();
    const id = data[0].id;

    expect(cb.callCount).to.be.equal(0);
    MenuStore._storeCallback({
      type: 'foo',
      data: {id: id}
    });
    expect(cb.callCount).to.be.equal(0);
    MenuStore.removeChangeListener(cb);
  });
});
