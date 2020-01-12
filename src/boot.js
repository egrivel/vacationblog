const React = require('react');
import ReactDOM from 'react-dom';
const Router = require('react-router').Router;
const hashHistory = require('react-router').hashHistory;
import {hot} from 'react-hot-loader/root';

import App from './components/App.jsx';
import Welcome from './components/Welcome.jsx';
import TripDescription from './components/TripDescription.jsx';
import TripEdit from './components/TripEdit.jsx';
import TripAdmin from './components/TripAdmin.jsx';
import UserEdit from './components/UserEdit.jsx';
import UserAdmin from './components/UserAdmin.jsx';
import JournalWrapper from './components/JournalWrapper.jsx';
import JournalEdit from './components/JournalEdit.jsx';
import Search from './components/Search.jsx';
import Preferences from './components/Preferences.jsx';
import Sync from './components/Sync.jsx';
import Admin from './components/Admin.jsx';
import About from './components/About.jsx';
import LoginWrapper from './components/LoginWrapper.jsx';
import Notification from './components/Notification.jsx';

import TripAction from './actions/TripAction';
import UserAction from './actions/UserAction';

import utils from './utils';

const routes = {
  path: '/',
  component: App,
  childRoutes: [
    {path: '/', component: Welcome},
    {path: '/login', component: LoginWrapper},
    {path: '/login/:target', component: LoginWrapper},
    {path: '/trip', component: TripDescription},
    {path: '/trip/:tripId', component: TripDescription},
    {path: '/journal/:tripId/:journalId', component: JournalWrapper},
    {path: '/journal/:tripId/:journalId/:map', component: JournalWrapper},
    {path: '/journaledit/:tripId', component: JournalEdit},
    {path: '/journaledit/:tripId/:journalId', component: JournalEdit},
    {path: '/search', component: Search},
    {path: '/prefs', component: Preferences},
    {path: '/admin', component: Admin},
    {path: '/admin/trip', component: TripAdmin},
    {path: '/admin/trip/:tripId', component: TripEdit},
    {path: '/admin/user', component: UserAdmin},
    {path: '/admin/user/:userId', component: UserEdit},
    {path: '/admin/sync', component: Sync},
    {path: '/admin/notification', component: Notification},
    {path: '/about', component: About}
  ]
};

// eslint-disable-next-line react/no-render-return-value
const root = ReactDOM.render(
  React.createElement(Router,
    {
      routes: routes,
      history: hashHistory
    }
  ),
  document.getElementById('react-root')
);

// Load the default trip on startup (until we have a better default)
TripAction.loadTripList();

// Check if logged in
const loginCookie = utils.getCookie(utils.cookies.AUTH);
if (loginCookie) {
  UserAction.loadLoggedInUser();
}

// Return where we left off (by default; maybe offer option to disable this
// later)
const lastEntryCookie = utils.getCookie(utils.cookies.ENTRY);
if (lastEntryCookie) {
  // eslint-disable-next-line no-undef
  let location = String(window.location);
  let originalDestination = '';
  for (let i = 0; i < location.length; i++) {
    if (location.charAt(i) === '#') {
      originalDestination = location.substring(i + 1);
      location = location.substring(0, i) + '#/' + lastEntryCookie;
      break;
    }
  }

  // "location" now contains the desired location, but only go there if the
  // initial location was at the root of the application. If the application
  // was started with a different URL than the root, changes are the user
  // followed a specific link so we don't want to interfere with that.
  if ((originalDestination === '') || (originalDestination === '/')) {
    // eslint-disable-next-line no-undef
    window.location = location;
  }
}

export default hot(root);
