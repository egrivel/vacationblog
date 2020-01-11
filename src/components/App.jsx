'use strict';

const React = require('react');
const createClass = require('create-react-class');
const PropTypes = require('prop-types');

const FacebookWrapper = require('./FacebookWrapper.jsx');
const Header = require('./Header.jsx');
const Welcome = require('./Welcome.jsx');
const Footer = require('./Footer.jsx');

/**
 * The application object renders the framework of the application, which
 * includes the header and footer. It allows for the page-specific content
 * to be inserted by the React Router, except when there is no router-inserted
 * content, it will default to a trip description page. This is the initial
 * view when someone enters the site.
 */
const App = createClass({
  displayName: 'App',

  propTypes: {
    children: PropTypes.object
  },

  render: function() {
    let children = this.props.children;
    if (!children || children.length === 0) {
      children = <Welcome/>;
    }
    return (
      <div className="body">
        <FacebookWrapper/>
        <Header/>
        <div className="content">
          {children}
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = App;
