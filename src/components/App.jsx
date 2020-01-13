'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import FacebookWrapper from './FacebookWrapper';
import Header from './Header';
import Welcome from './Welcome';
import Footer from './Footer';

/**
 * The application object renders the framework of the application, which
 * includes the header and footer. It allows for the page-specific content
 * to be inserted by the React Router, except when there is no router-inserted
 * content, it will default to a trip description page. This is the initial
 * view when someone enters the site.
 */
const App = createReactClass({
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

export default App;
