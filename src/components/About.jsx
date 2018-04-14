'use strict';

const React = require('react');

const MenuAction = require('../actions/MenuAction');
const MenuStore = require('../stores/MenuStore');

const About = React.createClass({
  displayName: 'About',

  componentDidMount: function() {
    MenuAction.selectItem(MenuStore.menuIds.ABOUT);
  },

  componentWillUnmount: function() {
    MenuAction.unselectItem(MenuStore.menuIds.ABOUT);
  },

  render: function() {
    return (
      <div>
        <h3>About This Website</h3>
        <p>Welcome to the <em>Eric Grivel and Nicoline Smits vacation
          blogging website</em>. This is where we share our vacation
          experiences.</p>

        <p>We started a Vacation Blog with out 2007 family
          roadtrip <em>Around the U.S. in Eight Weeks</em>. For that trip we
          had rented a minivan and criss-crossed the lower 48 states for eight
          weeks. While on the road we regularly wrote about our
          “adventures” on a website we created for this purpose.</p>

        <p>When we started planning our <em>I-70</em> trip
          in 2012, we found that we were discovering a lot of interesting
          information about America, the National Road, and the roads
          westward, so we wanted a place to record and share all of that
          information. We copied the code for the 2007 website to a new
          location and, with a few modifications, used that to blog about
          our 2012 trip.</p>

        <p>In following years we continued to create new sites by copying
          the previous year’s site, which worked well for a while, but
          then started to become tedious. So after the
          2015 <em>Oklahoma</em> trip, we decided to re-do the whole thing into
          a modernized, integrated vacation blog.</p>

        <p>The result is what you are looking at now. Whenever we embark
          on a major vaction (short trips don’t count), we will start a
          new trip to blog about on this site. It will become part of our
          vacation memories, and we hope our friends and family enjoy
          reading about our exploits as well.</p>

        <p className="signature">
          <em>Eric Grivel</em><br />
          <em>Nicoline Smits</em></p>
      </div>
    );
  }
});

module.exports = About;
