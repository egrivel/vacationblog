<?php
include_once("../database/database.php");
include_once("../database/Auth.php");
include_once("../database/Comment.php");
include_once("../database/Feedback.php");
include_once("../database/Journal.php");
include_once("../database/Media.php");
include_once("../database/Setting.php");
include_once("../database/Trip.php");
include_once("../database/TripAttribute.php");
include_once("../database/TripUser.php");
include_once("../database/User.php");

$setting = new Setting();
$version = $setting->getDataVersion();

function updateTables($version) {
   Auth::updateTables($version);
   Comment::updateTables($version);
   Feedback::updateTables($version);
   Journal::updateTables($version);
   Media::updateTables($version);
   Setting::updateTables($version);
   Trip::updateTables($version);
   TripAttribute::updateTables($version);
   TripUser::updateTables($version);
   User::updateTables($version);
   print "Tables have been updated. ";
}

function validateUser() {
   $name = $_POST['name'];
   $fullname = $_POST['fullname'];
   $password = $_POST['password'];
   $password2 = $_POST['password2'];
   $synchPassword = $_POST['synch-password'];
   $synchPassword2 = $_POST['synch-password2'];
   $email = $_POST['email'];

   $errors = '';
   if (!$name) {
      $errors .= "<li>Please provide a username</li>\n";
   }

   if (!$fullname) {
      $errors .= "<li>Please provide a full name</li>\n";
   }

   if (!$password) {
      $errors .= "<li>Please provide a password</li>\n";
   } else if ($password2 !== $password) {
      $errors .= "<li>Passwords do not match</li>\n";
   }

   if (!$synchPassword) {
      $errors .= "<li>Please provide a synch password</li>\n";
   } else if ($synchPassword2 !== $synchPassword) {
      $errors .= "<li>Synch passwords do not match</li>\n";
   }

   if (!$fullname) {
      $errors .= "<li>Please provide an email address</li>\n";
   }

   return $errors;
}

function showForm($errors) {
   $name = $_POST['name'];
   $fullname = $_POST['fullname'];
   $password = $_POST['password'];
   $password2 = $_POST['password2'];
   $email = $_POST['email'];

   print "<!DOCTYPE>
<html>
  <head>
    <title>Initialize Database</title>
  </head>
  <body>
    <h1>Initialize Database</h1>
    <p>This page is displayed because the database for the Vacation Blog
      has not yet been initialized. Please provide the information on this
      page to initialize the database.</p>\n";

   if ($errors) {
      print "<ul style='color: red'>$errors</ul>\n";
   }

   print "
    <form method='POST' action='CreateTables.php'>
      <p>
        <label for='name'>User Name:</label>
        <input type='text' name='name' id='name' value='$name' size='32' maxlength='32'/>
      </p>

      <p>
        <label for='fullname'>Full Name:</label>
        <input type='text' name='fullname' id='fullname' value='$fullname' size='32' maxlength='64'/>
      </p>

      <p>
        <label for='password'>Password:</label>
        <input type='password' name='password' id='password' value='$password' size='32' maxlength='32'/>
      </p>

      <p>
        <label for='password2'>Repeat Password:</label>
        <input type='password' name='password2' id='password2' value='$password2' size='32' maxlength='32'/>
      </p>

      <p>
        <label for='email'>Email:</label>
        <input type='text' name='email' id='email' value='$email' size='32' maxlength='64'/>
      </p>

      <hr/>
      <p>Synchronization password is needed to synchronize with a different
        instance of the website.</p>

      <p>
        <label for='synch-password'>Synch Password:</label>
        <input type='password' name='synch-password' id='synch-password'
          value='$synchPassword' size='32' maxlength='32'/>
      </p>

      <p>
        <label for='synch-password2'>Repeat Sync Password:</label>
        <input type='password' name='synch-password2' id='synch-password2'
          value='$synchPassword2' size='32' maxlength='32'/>
      </p>

      <p>
        <input type='submit' name='do' id='do' value='Initialize Database'/>
        <input type='submit' name='cancel' id='cancel' value='Cancel'/>
    </form>
  </body>
</html>
";

   print "<!DOCTYPE html\n";
   print "<html>\n";
   exit(0);
}

if ($version === "") {
   // There are no tables yet, so tables must be created. To create,
   // we need to have the initial user information.

   $name = $_POST['name'];
   $fullname = $_POST['fullname'];
   $password = $_POST['password'];
   $password2 = $_POST['password2'];
   $synchPassword = $_POST['synch-password'];
   $synchPassword2 = $_POST['synch-password2'];
   $email = $_POST['email'];
   $do = $_POST['do'];

   if ($do) {
      // got user input, check it
      $errors = validateUser();
      if ($errors) {
         showForm($errors);
      } else {
         updateTables($version);

         $user = new User($name);
         $user->setName($fullname);
         $user->setPassword($password);
         $user->setAccess(LEVEL_ADMIN);
         $user->setEmail($email);
         $user->save();

         $user = new User(SYNCH_USER);
         $user->setName('Synchronization User');
         $user->setPassword($synchPassword);
         $user->setAccess(LEVEL_SYNCH);
         $user->setEmail('dummy-email-for-synch');
         $user->save();
      }
   } else {
      showForm('');
   }
} else {
   updateTables($version);
}

?>
OK
