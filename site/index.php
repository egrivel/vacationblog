<?php
include_once(dirname(__FILE__) . "/common/common.php");
include_once(dirname(__FILE__) . '/database/Trip.php');
include_once(dirname(__FILE__) . '/database/Journal.php');
include_once(dirname(__FILE__) . '/database/Media.php');

$tripId = '';
$tripObj = null;

// First, check if we are using an unsecure connection to egrivel and upgrade
// it to a secure one if needed
$uri = $_SERVER['SCRIPT_URI'];
if (preg_match('/^(https?):\/\/((www\.)?egrivel\.net)\/(.*)$/', $uri, $matches)) {
  $protocol = strtolower($matches[1]);
  $web = strtolower($matches[2]);
  $path = $matches[4];
  if ($protocol === 'http') {
    header("Location: https://$web/$path");
    exit(0);
  }
}

function getTrip() {
  global $tripId, $tripObj;

  if ($tripId === '') {
    $tripId = Trip::findCurrentTrip();
  }
  if ($tripId !== '') {
    $tripObj = new Trip($tripId);
    if ($tripObj->getCreated() === null) {
      // Trip object not found
      $tripObj = null;
    }
  }
}

function getTripTitle() {
  return "Vacation Website: Curacao";
  global $tripObj;
  getTrip();

  if ($tripObj) {
    return "Vacation Website: " . $tripObj->getName();
  }
  return "Vacation Website";
}

function getTripDescr() {
  return "Taking a short vacation to Curacao.";
  global $tripObj;
  getTrip();

  if (!$tripObj) {
    return "";
  }
  $descr = $tripObj->getDescription();
  if (!$descr) {
    return "";
  }

  $descr = str_replace('"', '&quot;', $descr);
  $descr = str_replace('&lf;', "\n", $descr);

  $descr = preg_replace('/\[.*?\]/', '', $descr);
  return trim($descr);
}

function getMediaUrl() {
  global $tripId;
  // getTrip();

  $defaultMediaUrl = 'http://www.grivel.net/vacationblog/site/media/vak2017-2-fb-banner.png';
  return $defaultMediaUrl;
}


?><!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="utf-8" />
    <meta http-equiv='Content-Type' content='text/html;charset=utf-8' />
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="Vacation Blog">
    <meta name="author" content="Eric Grivel">
    <link rel="shortcut icon" href="./media/favicon.ico">
    <!-- Properties for facebook -->
    <meta property="fb:admins" content="552452884" />
    <meta property="og:url" content="http://www.grivel.net/vacationblog/site/" />
    <meta property="og:title" content="<?php print getTriptitle(); ?>" />
    <meta property="og:description" content="<?php print getTripDescr(); ?>" />
    <meta property="og:image" content="<?php print getMediaUrl(); ?>" />

    <link href='https://fonts.googleapis.com/css?family=Droid+Serif:400,400italic,700,700italic|Merriweather+Sans|Lato:700|Roboto:400,400italic,700,700italic' rel='stylesheet' type='text/css'>

    <script src="https://use.fontawesome.com/75a2a1cfb9.js"></script>

    <!--
      <link href='css/font-awesome.css' rel='stylesheet' type='text/css'>
    -->
    <title>Vacation website</title>
    <style type='text/css'>
      @import url('css/reset.css');
      @import url('css/site.css');
    </style>
  </head>
  <body>
    <!-- facebook SDK -->
    <script>
      window.fbAsyncInit = function() {
        FB.init({
          appId            : '1155448634594863',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v2.12'
        });
      };

      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script>
    <div id="fb-root"></div>
    <div id='react-root'>
      <script src='js/boot.js'></script>
    </div>
  </body>
</html>
