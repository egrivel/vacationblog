<?php
include("common.php");
print pageStart("Login Flow");
?>

<h2>Contents</h2>

<ul>
  <li><a href='#normal-login'>Normal Login</a></li>
  <li><a href='facebook-login'>Facebook Login</a></li>
  <li><a href='#normal-autologin'>Normal Auto-Login</a></li>
  <li><a href='facebook-autologin'>Facebook Auto-Login</a></li>
  <li><a href='#normal-logout'>Normal Logout</a></li>
  <li><a href='facebook-logout'>Facebook Logout</a></li>
</ul>

<?php print gl_top_link(); ?>

<h2 id="normal-login">Normal Login</h2>

<p>The normal login process starts by invoking the login link,
  which brings up the <code>Login.jsx</code> modal window.
  The user enters their user ID (or email) and password, and
  clicks the button.</p>

<p><code>LoginAction.doLogin()</code> is called, which in turn calls
  <code>api/login.php</code> API. The API does the actual logging
  in and issues a token, which is saved in a cookie. In addition:</p>

<ul>
  <li><code>UserAction.setLoginState()</code> is called with the <code>NONE</code>
  state indicator, since the login process is finished.</li>
  <li><code>UserAction.setLoggedInUser()</code> is called with the user ID of the
  user.</li>
  <li><code>UserAction.loadUser()</code> is called to load the user's name
  and other information. This in turn calls the <code>api/getUser.php</code>,
  which asynhronously updates the <em>user data</em> in the store.</li>
</ul>

<?php print gl_top_link(); ?>

<h2 id="facebook-login">Facebook Login</h2>

<?php print gl_top_link(); ?>

<h2 id="normal-autologin">Normal Auto-Login</h2>

<?php print gl_top_link(); ?>

<h2 id="facebook-autologin">Facebook Auto-Login</h2>

<?php print gl_top_link(); ?>

<h2 id="normal-logout">Normal Logout</h2>

<?php print gl_top_link(); ?>

<h2 id="facebook-logout">Facebook Logout</h2>

<?php print pageEnd(); ?>
