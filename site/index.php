<?php
include_once(dirname(__FILE__) . "/common/common.php");
include_once(dirname(__FILE__) . '/database/Trip.php');
include_once(dirname(__FILE__) . '/database/Journal.php');
include_once(dirname(__FILE__) . '/database/Media.php');

$tripId = '';
$tripObj = null;

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
  global $tripObj;
  getTrip();

  if ($tripObj) {
    return "Vacation Website: " . $tripObj->getName();
  }
  return "Vacation Website";
}

function getTripDescr() {
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
  getTrip();

  $defaultMediaUrl = 'media/vak2017-banner.php';
  if ($tripId === '') {
    // No current trip, return default
    return $defaultMediaUrl;
  }

  $lastJournalId = Journal::getLastJournalId($tripId);
  if (!$lastJournalId) {
    // last journal not found, return default
    return $defaultMediaUrl;
  }

  $journal = new Journal($tripId, $lastJournalId);
  if ($journal->getCreated() === null) {
    // Cannot get last journal
    return $defaultMediaUrl;
  }

  $mediaId = '';
  while(true) {
    $journalText = $journal->getJournalText();
    if ($journalText) {
      $list = explode('[IMG ', $journalText);
      for ($i = 0; isset($list[$i]); $i++) {
        if (preg_match('/^\s*(\d\d\d\d\d\d\d\d-\d\d\d\d\d\d\w?)/',
            $list[$i], $matches)) {
          $mediaId = $matches[0];
          break;
        }
      }
      if ($mediaId !== '') {
        break;
      }
    }
    $prevJournalId = $journal->getPreviousJournalId();
    if (!$prevJournalId) {
      // No previous journal, so stop searching
      break;
    }
    $journal = new Journal($tripId, $prevJournalId);
    if ($journal->getCreated() === null) {
      // previous journal not found, so stop searching
      break;
    }
    // continue to previous journal to find an image
  }

  if ($mediaId === '') {
    // No media found
    return $defaultMediaUrl;
  }

  $media = new Media($tripId, $mediaId);
  if ($media->getCreated() === null) {
    // media not found
    return $defaultMediaUrl;
  }

  $location = $media->getLocation();
  if ($location === 'grivel') {
    return "http://www.grivel.net/blogphotos/$mediaId.jpg";
  } else {
    return "http://photos-egrivel.rhcloud.com/phimg?large=$mediaId";
  }
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
    <div id='react-root'>
      <script src='js/boot.js'></script>
    </div>
  </body>
</html>
