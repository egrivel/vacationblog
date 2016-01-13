<?php
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
if ($version === "") {
   $config = parse_ini_file('./defaultUser.ini');
   $user = new User($config['username']);
   if ($user->getName() === "") {
      // default user "eric" doesn't exist
      print "<p>Initialize user $user</p>\n";
      $user->setName($config['fullname']);
      $user->setPassword($config['password']);
      $user->setAccess("admin");
      $user->setEmail($config['email']);
      $user->save();
   }
 }
?>
