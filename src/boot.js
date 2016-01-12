// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var Header = require('./components/Header');
var Footer = require('./components/Footer');
var TripDescription = require('./components/TripDescription');
var TripAction = require('./actions/TripAction');
var TripStore = require('./stores/TripStore');
var JournalEntry = require('./components/JournalEntry');

/**
 * The application object renders the framework of the application, which
 * includes the header and footer. It allows for the page-specific content
 * to be inserted by the React Router, except when there is no router-inserted
 * content, it will default to a trip description page. This is the initial
 * view when someone enters the site.
 */
var App = React.createClass({
  render: function() {
    var children = this.props.children;
    if (!children || children.length === 0) {
      children = React.createElement(TripDescription, null);
    }
    return React.DOM.div(
      null,
      React.createElement(Header, null),
      children,
      React.createElement(Footer, null)
    )
  }
});
 
const routes = {
  path: '/',
  component: App,
  childRoutes: [
    { path: '/', component: TripDescription },
    { path: '/trip', component: TripDescription },
    { path: '/trip/:tripId', component: TripDescription },
    { path: '/journal/:tripId', component: JournalEntry },
    { path: '/journal/:tripId/:journalId', component: JournalEntry }
  ]
};

ReactDOM.render(
  React.createElement(Router, {routes: routes}),
  document.getElementById('body')
);

// Load the default trip on startup (until we have a better default)
TripAction.loadTripList();
setInterval(TripAction.loadTripList, 30000);
