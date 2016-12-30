<?php
/* ========================================================================= */
/* Synchronization - Master and Slave                                        */
/*                                                                           */
/* Synchronization is a process by which two sites (instances of the same    */
/* vacation blog) end up with the same content.                              */
/*                                                                           */
/* Synchronization is initiated from the UI by a user with administrative    */
/* privileges through a call to the synchMaster.php script. The user has to  */
/* provide the destination site as well as the synchronization password (the */
/* password used to set up the "-sync" user).                                */
/*                                                                           */
/* The synchMaster.php will call the synchSlave.php script on the            */
/* destination site to get a list of all the database items that are present */
/* on the destination site.                                                  */
/*                                                                           */
/* The synchMaster.php will then retrieve all the database items it does not */
/* yet have from the destination side, and will push all the items the       */
/* destination does not have to that destination site.                       */
/* ========================================================================= */

include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . "/../database/Comment.php");
include_once(dirname(__FILE__) . "/../database/Feedback.php");
include_once(dirname(__FILE__) . "/../database/Journal.php");
include_once(dirname(__FILE__) . "/../database/Media.php");
include_once(dirname(__FILE__) . "/../database/Trip.php");
include_once(dirname(__FILE__) . "/../database/TripAttribute.php");
include_once(dirname(__FILE__) . "/../database/TripUser.php");
include_once(dirname(__FILE__) . "/../database/User.php");

function synchComment($site, $authId, $remoteHashes) {
  $url = $site . '/api/synchComment.php';
  $localAdded = 0;
  $remoteAdded = 0;
  $result = '';

  $localHashes = Comment::getHashList();
  if ($remoteHashes) {
    $diff = array_diff($localHashes, $remoteHashes);
  } else {
    $diff = $localHashes;
  }

  // $diff contains the local entries that must be pushed
  foreach ($diff as $hash) {
    $item = Comment::findByHash($hash);
    if ($item) {
      $data = Array();
      $data['tripId'] = $item->getTripId();
      $data['commentId'] = $item->getCommentId();
      $data['created'] = $item->getCreated();
      $data['updated'] = $item->getUpdated();
      $data['userId'] = $item->getUserId();
      $data['referenceId'] = $item->getReferenceId();
      $data['commentText'] = $item->getCommentText();
      $data['deleted'] = $item->getDeleted();
      $data['hash'] = $item->getHash();

      $opts = array('http' =>
        array(
          'method'  => 'PUT',
          'header'  => "Content-Type: application/json\r\n".
            "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
          'content' => json_encode($data),
          'timeout' => 60
        )
      );
      $context  = stream_context_create($opts);
      $putResponse = file_get_contents($url, false, $context);
      $remoteAdded++;
    }
  }

  $diff = array_diff($remoteHashes, $localHashes);
  // $diff contains the remote entries that must be obtained
  foreach ($diff as $hash) {
    $opts = array('http' =>
      array(
        'method'  => 'GET',
        'header'  => "Content-Type: application/json\r\n".
          "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
        'timeout' => 60
      )
    );
    $context  = stream_context_create($opts);
    $rawdata = file_get_contents($url . '?hash=' . urlencode($hash), false, $context);
    $data = json_decode($rawdata, true);
    if (isset($data['tripid']) && isset($data['commentId'])) {
      $item = Comment::findByHash($data['hash']);
      if (!$item) {
        // Don't have this hash yet, so add it
        $tripId = $data['tripId'];
        $commentId = $data['commentId'];
        $item = new Comment($tripId, $commentId);
        if (isset($data['created'])) {
           $item->setCreated($data['created']);
        }
        if (isset($data['updated'])) {
           $item->setUpdated($data['updated']);
        }
        if (isset($data['referenceId'])) {
           $item->setReferenceId($data['referenceId']);
        }
        if (isset($data['commentText'])) {
           $item->setCommentText($data['commentText']);
        }
        if (isset($data['deleted'])) {
           $item->setDeleted($data['deleted']);
        }
        if (isset($data['hash'])) {
           $item->setHash($data['hash']);
        }
        if ($item->save()) {
          $localAdded++;
        } else {
          $result .= 'error adding comment ' . $tipId . ' ' . $commentId . '   ';
        }
      }
    } else {
      $result .= 'error getting comment data for hash ' . $hash .
        ': ' . $rawdata . '   ';
    }
  }
  return 'Comment: Local added: ' . $localAdded . ', Remote added: ' . $remoteAdded
    . ', message: ' . $result;
}

function synchFeedback($site, $authId, $remoteHashes) {
  $url = $site . '/api/synchFeedback.php';
  $localAdded = 0;
  $remoteAdded = 0;
  $result = '';

  $localHashes = Feedback::getHashList();
  if ($remoteHashes) {
    $diff = array_diff($localHashes, $remoteHashes);
  } else {
    $diff = $localHashes;
  }

  // $diff contains the local entries that must be pushed
  foreach ($diff as $hash) {
    $item = Feedback::findByHash($hash);
    if ($item) {
      $data = Array();
      $data['tripId'] = $item->getTripId();
      $data['referenceId'] = $item->getReferenceId();
      $data['userId'] = $item->getUserId();
      $data['created'] = $item->getCreated();
      $data['updated'] = $item->getUpdated();
      $data['type'] = $item->getType();
      $data['deleted'] = $item->getDeleted();
      $data['hash'] = $item->getHash();

      $opts = array('http' =>
        array(
          'method'  => 'PUT',
          'header'  => "Content-Type: application/json\r\n".
            "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
          'content' => json_encode($data),
          'timeout' => 60
        )
      );
      $context  = stream_context_create($opts);
      $putResponse = file_get_contents($url, false, $context);
      $remoteAdded++;
    }
  }

  $diff = array_diff($remoteHashes, $localHashes);
  // $diff contains the remote entries that must be obtained
  foreach ($diff as $hash) {
    $opts = array('http' =>
      array(
        'method'  => 'GET',
        'header'  => "Content-Type: application/json\r\n".
          "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
        'timeout' => 60
      )
    );
    $context  = stream_context_create($opts);
    $rawdata = file_get_contents($url . '?hash=' . urlencode($hash), false, $context);
    $data = json_decode($rawdata, true);
    if (isset($data['tripId']) && isset($data['referenceId']) && isset($data['userId'])) {
      $item = Feedback::findByHash($data['hash']);
      if (!$item) {
        // Don't have this hash yet, so add it
        $tripId = $data['tripId'];
        $referenceId = $data['referenceId'];
        $userId = $data['userId'];
        $item = new Feedback($tripId, $referenceId, $userId);
        if (isset($data['created'])) {
           $item->setCreated($data['created']);
        }
        if (isset($data['updated'])) {
           $item->setUpdated($data['updated']);
        }
        if (isset($data['type'])) {
           $item->setType($data['type']);
        }
        if (isset($data['deleted'])) {
           $item->setDeleted($data['deleted']);
        }
        if (isset($data['hash'])) {
           $item->setHash($data['hash']);
        }
        if ($item->save()) {
          $localAdded++;
        } else {
          $result .= 'error adding feedback ' . $tripId . ' ' . $referenceId . ' ' . $userId . '   ';
        }
      }
    } else {
      $result .= 'error getting feedback data for hash ' . $hash . ', data = ' . $rawdata . '   ';
    }
  }
  return 'Feedback: Local added: ' . $localAdded . ', Remote added: ' . $remoteAdded
    . ', message: ' . $result;
}

function synchJournal($site, $authId, $remoteHashes) {
  $url = $site . '/api/synchJournal.php';
  $localAdded = 0;
  $remoteAdded = 0;
  $result = '';

  $localHashes = Journal::getHashList();
  if ($remoteHashes) {
    $diff = array_diff($localHashes, $remoteHashes);
  } else {
    $diff = $localHashes;
  }

  // $diff contains the local entries that must be pushed
  foreach ($diff as $hash) {
    $item = Journal::findByHash($hash);
    if ($item) {
      $data = Array();
      $data['tripId'] = $item->getTripId();
      $data['journalId'] = $item->getJournalId();
      $data['created'] = $item->getCreated();
      $data['updated'] = $item->getUpdated();
      $data['userId'] = $item->getUserId();
      $data['journalDate'] = $item->getJournalDate();
      $data['journalTitle'] = $item->getJournalTitle();
      $data['journalText'] = $item->getJournalText();
      $data['deleted'] = $item->getDeleted();
      $data['hash'] = $item->getHash();

      $opts = array('http' =>
        array(
          'method'  => 'PUT',
          'header'  => "Content-Type: application/json\r\n".
            "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
          'content' => json_encode($data),
          'timeout' => 60
        )
      );
      $context  = stream_context_create($opts);
      $putResponse = file_get_contents($url, false, $context);
      $remoteAdded++;
    }
  }

  $diff = array_diff($remoteHashes, $localHashes);
  // $diff contains the remote entries that must be obtained
  foreach ($diff as $hash) {
    $opts = array('http' =>
      array(
        'method'  => 'GET',
        'header'  => "Content-Type: application/json\r\n".
          "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
        'timeout' => 60
      )
    );
    $context  = stream_context_create($opts);
    $rawdata = file_get_contents($url . '?hash=' . urlencode($hash), false, $context);
    $data = json_decode($rawdata, true);
    if (isset($data['tripId']) && isset($data['journalId'])) {
      $item = Journal::findByHash($data['hash']);
      if (!$item) {
        // Don't have this hash yet, so add it
        $tripId = $data['tripId'];
        $journalId = $data['journalId'];
        $item = new Journal($tripId, $journalId);
        if (isset($data['created'])) {
           $item->setCreated($data['created']);
        }
        if (isset($data['updated'])) {
           $item->setUpdated($data['updated']);
        }
        if (isset($data['userId'])) {
           $item->setUserId($data['userId']);
        }
        if (isset($data['journalDate'])) {
           $item->setJournalDate($data['journalDate']);
        }
        if (isset($data['journalTitle'])) {
           $item->setJournalTitle($data['journalTitle']);
        }
        if (isset($data['journalText'])) {
           $item->setJournalText($data['journalText']);
        }
        if (isset($data['deleted'])) {
           $item->setDeleted($data['deleted']);
        }
        if (isset($data['hash'])) {
           $item->setHash($data['hash']);
        }
        if ($item->save()) {
          $localAdded++;
        } else {
          $result .= 'error adding journal ' . $tripId . ' ' . $journalId . '   ';
        }
      }
    } else {
      $result .= 'error getting journal data for hash ' . $hash . ': ' .
        $rawdata . '   ';
    }
  }
  return 'Journal: Local added: ' . $localAdded . ', Remote added: ' . $remoteAdded
    . ', message: ' . $result;
}

function synchMedia($site, $authId, $remoteHashes) {
  $url = $site . '/api/synchMedia.php';
  $localAdded = 0;
  $remoteAdded = 0;
  $result = '';

  $localHashes = Media::getHashList();
  if ($remoteHashes) {
    $diff = array_diff($localHashes, $remoteHashes);
  } else {
    $diff = $localHashes;
  }

  // $diff contains the local entries that must be pushed
  foreach ($diff as $hash) {
    $item = Media::findByHash($hash);
    if ($item) {
      $data = Array();
      $data['tripId'] = $item->getTripId();
      $data['mediaId'] = $item->getMediaId();
      $data['created'] = $item->getCreated();
      $data['updated'] = $item->getUpdated();
      $data['type'] = $item->getType();
      $data['caption'] = $item->getCaption();
      $data['timestamp'] = $item->getTimestamp();
      $data['location'] = $item->getLocation();
      $data['width'] = $item->getWidth();
      $data['height'] = $item->getHeight();
      $data['deleted'] = $item->getDeleted();
      $data['hash'] = $item->getHash();

      $opts = array('http' =>
        array(
          'method'  => 'PUT',
          'header'  => "Content-Type: application/json\r\n".
            "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
          'content' => json_encode($data),
          'timeout' => 60
        )
      );
      $context  = stream_context_create($opts);
      $putResponse = file_get_contents($url, false, $context);
      $remoteAdded++;
    }
  }

  $diff = array_diff($remoteHashes, $localHashes);
  // $diff contains the remote entries that must be obtained
  foreach ($diff as $hash) {
    $opts = array('http' =>
      array(
        'method'  => 'GET',
        'header'  => "Content-Type: application/json\r\n".
          "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
        'timeout' => 60
      )
    );
    $context  = stream_context_create($opts);
    $rawdata = file_get_contents($url . '?hash=' . urlencode($hash), false, $context);
    $data = json_decode($rawdata, true);
    if (isset($data['tripId']) && isset($data['mediaId'])) {
      $item = Media::findByHash($data['hash']);
      if (!$item) {
        // Don't have this hash yet, so add it
        $tripId = $data['tripId'];
        $mediaId = $data['mediaId'];
        $item = new Media($tripId, $mediaId);
        if (isset($data['created'])) {
           $item->setCreated($data['created']);
        }
        if (isset($data['updated'])) {
           $item->setUpdated($data['updated']);
        }
        if (isset($data['type'])) {
           $item->setType($data['type']);
        }
        if (isset($data['caption'])) {
           $item->setCaption($data['caption']);
        }
        if (isset($data['timestamp'])) {
           $item->setTimestamp($data['timestamp']);
        }
        if (isset($data['location'])) {
           $item->setLocation($data['location']);
        }
        if (isset($data['width'])) {
           $item->setWidth($data['width']);
        }
        if (isset($data['height'])) {
           $item->setHeight($data['height']);
        }
        if (isset($data['deleted'])) {
           $item->setDeleted($data['deleted']);
        }
        if (isset($data['hash'])) {
           $item->setHash($data['hash']);
        }
        if ($item->save()) {
          $localAdded++;
        } else {
          $result .= 'error adding media ' . $tripId . ' ' . $mediaId . '   ';
        }
      }
    } else {
      $result .= 'error getting media data for hash ' . $hash . ': ' .
        $rawdata . '   ';
    }
  }
  return 'Media: Local added: ' . $localAdded . ', Remote added: ' . $remoteAdded
    . ', message: ' . $result;
}

function synchTrip($site, $authId, $remoteHashes) {
  $url = $site . '/api/synchTrip.php';
  $localAdded = 0;
  $remoteAdded = 0;
  $result = '';

  $localHashes = Trip::getHashList();
  if ($remoteHashes) {
    $diff = array_diff($localHashes, $remoteHashes);
  } else {
    $diff = $localHashes;
  }

  // $diff contains the local entries that must be pushed
  foreach ($diff as $hash) {
    $trip = Trip::findByHash($hash);
    if ($trip) {
      $data = Array();
      $data['tripId'] = $trip->getTripId();
      $data['created'] = $trip->getCreated();
      $data['updated'] = $trip->getUpdated();
      $data['name'] = $trip->getName();
      $data['description'] = $trip->getDescription();
      $data['bannerImg'] = $trip->getBannerImg();
      $data['startDate'] = $trip->getStartDate();
      $data['endDate'] = $trip->getEndDate();
      $data['active'] = $trip->getActive();
      $data['deleted'] = $trip->getDeleted();
      $data['hash'] = $trip->getHash();

      $opts = array('http' =>
        array(
          'method'  => 'PUT',
          'header'  => "Content-Type: application/json\r\n".
            "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
          'content' => json_encode($data),
          'timeout' => 60
        )
      );
      $context  = stream_context_create($opts);
      $putResponse = file_get_contents($url, false, $context);
      $remoteAdded++;
    }
  }

  $diff = array_diff($remoteHashes, $localHashes);
  // $diff contains the remote entries that must be obtained
  foreach ($diff as $hash) {
    $opts = array('http' =>
      array(
        'method'  => 'GET',
        'header'  => "Content-Type: application/json\r\n".
          "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
        'timeout' => 60
      )
    );
    $context  = stream_context_create($opts);
    $rawdata = file_get_contents($url . '?hash=' . urlencode($hash), false, $context);
    $data = json_decode($rawdata, true);
    if (isset($data['tripId'])) {
      $trip = Trip::findByHash($data['hash']);
      if (!$trip) {
        // Don't have this hash yet, so add it
        $tripId = $data['tripId'];
        $trip = new Trip($tripId);
        if (isset($data['created'])) {
           $trip->setCreated($data['created']);
        }
        if (isset($data['updated'])) {
           $trip->setUpdated($data['updated']);
        }
        if (isset($data['name'])) {
           $trip->setName($data['name']);
        }
        if (isset($data['description'])) {
           $trip->setDescription($data['description']);
        }
        if (isset($data['bannerImg'])) {
           $trip->setBannerImg($data['bannerImg']);
        }
        if (isset($data['startDate'])) {
           $trip->setStartDate($data['startDate']);
        }
        if (isset($data['endDate'])) {
           $trip->setEndDate($data['endDate']);
        }
        if (isset($data['active'])) {
           $trip->setActive($data['active']);
        }
        if (isset($data['deleted'])) {
           $trip->setDeleted($data['deleted']);
        }
        if (isset($data['hash'])) {
           $trip->setHash($data['hash']);
        }
        if ($trip->save()) {
          $localAdded++;
        } else {
          $result .= 'error adding trip ' . $tripId . '   ';
        }
      }
    } else {
      $result .= 'error getting trip data for hash ' . $hash . ': ' .
        $rawdata . '   ';
    }
  }
  return 'Local added: ' . $localAdded . ', Remote added: ' . $remoteAdded
    . ', message: ' . $result;
}

function synchTripAttribute($site, $authId, $remoteHashes) {
  $url = $site . '/api/synchTripAttribute.php';
  $localAdded = 0;
  $remoteAdded = 0;
  $result = '';

  $localHashes = TripAttribute::getHashList();
  if ($remoteHashes) {
    $diff = array_diff($localHashes, $remoteHashes);
  } else {
    $diff = $localHashes;
  }

  // $diff contains the local entries that must be pushed
  foreach ($diff as $hash) {
    $item = TripAttribute::findByHash($hash);
    if ($item) {
      $data = Array();
      $data['tripId'] = $item->getTripId();
      $data['name'] = $item->getName();
      $data['created'] = $item->getCreated();
      $data['updated'] = $item->getUpdated();
      $data['value'] = $item->getValue();
      $data['deleted'] = $item->getDeleted();
      $data['hash'] = $item->getHash();

      $opts = array('http' =>
        array(
          'method'  => 'PUT',
          'header'  => "Content-Type: application/json\r\n".
            "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
          'content' => json_encode($data),
          'timeout' => 60
        )
      );
      $context  = stream_context_create($opts);
      $putResponse = file_get_contents($url, false, $context);
      $remoteAdded++;
    }
  }

  $diff = array_diff($remoteHashes, $localHashes);
  // $diff contains the remote entries that must be obtained
  foreach ($diff as $hash) {
    $opts = array('http' =>
      array(
        'method'  => 'GET',
        'header'  => "Content-Type: application/json\r\n".
          "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
        'timeout' => 60
      )
    );
    $context  = stream_context_create($opts);
    $rawdata = file_get_contents($url . '?hash=' . urlencode($hash), false, $context);
    $data = json_decode($rawdata, true);
    if (isset($data['tripId']) && isset($data['name'])) {
      $item = TripAttribute::findByHash($data['hash']);
      if (!$item) {
        // Don't have this hash yet, so add it
        $tripId = $data['tripId'];
        $name = $data['name'];
        $item = new TripAttribute($tripId, $name);
        if (isset($data['created'])) {
           $item->setCreated($data['created']);
        }
        if (isset($data['updated'])) {
           $item->setUpdated($data['updated']);
        }
        if (isset($data['value'])) {
           $item->setValue($data['value']);
        }
        if (isset($data['deleted'])) {
           $item->setDeleted($data['deleted']);
        }
        if (isset($data['hash'])) {
           $item->setHash($data['hash']);
        }
        if ($item->save()) {
          $localAdded++;
        } else {
          $result .= 'error adding trip attribute ' . $tripId . ' ' . $name . '   ';
        }
      }
    } else {
      $result .= 'error getting trip attribute data for hash ' . $hash . ': ' .
        $rawdata . '   ';
    }
  }
  return 'TripAttribute: Local added: ' . $localAdded . ', Remote added: ' . $remoteAdded
    . ', message: ' . $result;
}

function synchTripUser($site, $authId, $remoteHashes) {
  $url = $site . '/api/synchTripUser.php';
  $localAdded = 0;
  $remoteAdded = 0;
  $result = '';

  $localHashes = TripUser::getHashList();
  if ($remoteHashes) {
    $diff = array_diff($localHashes, $remoteHashes);
  } else {
    $diff = $localHashes;
  }

  // $diff contains the local entries that must be pushed
  foreach ($diff as $hash) {
    $item = TripUser::findByHash($hash);
    if ($item) {
      $data = Array();
      $data['tripId'] = $item->getTripId();
      $data['userId'] = $item->getUserId();
      $data['created'] = $item->getCreated();
      $data['updated'] = $item->getUpdated();
      $data['role'] = $item->getRole();
      $data['message'] = $item->getMessage();
      $data['profileImg'] = $item->getProfileImg();
      $data['deleted'] = $item->getDeleted();
      $data['hash'] = $item->getHash();

      $opts = array('http' =>
        array(
          'method'  => 'PUT',
          'header'  => "Content-Type: application/json\r\n".
            "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
          'content' => json_encode($data),
          'timeout' => 60
        )
      );
      $context  = stream_context_create($opts);
      $putResponse = file_get_contents($url, false, $context);
      $remoteAdded++;
    }
  }

  $diff = array_diff($remoteHashes, $localHashes);
  // $diff contains the remote entries that must be obtained
  foreach ($diff as $hash) {
    $opts = array('http' =>
      array(
        'method'  => 'GET',
        'header'  => "Content-Type: application/json\r\n".
          "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
        'timeout' => 60
      )
    );
    $context  = stream_context_create($opts);
    $rawdata = file_get_contents($url . '?hash=' . urlencode($hash), false, $context);
    $data = json_decode($rawdata, true);
    if (isset($data['tripId']) && isset($data['userId'])) {
      $item = TripUser::findByHash($data['hash']);
      if (!$item) {
        // Don't have this hash yet, so add it
        $tripId = $data['tripId'];
        $userId = $data['userId'];
        $item = new TripUser($tripId, $userId);
        if (isset($data['created'])) {
           $item->setCreated($data['created']);
        }
        if (isset($data['updated'])) {
           $item->setUpdated($data['updated']);
        }
        if (isset($data['role'])) {
           $item->setRole($data['role']);
        }
        if (isset($data['message'])) {
           $item->setMessage($data['message']);
        }
        if (isset($data['profileImg'])) {
           $item->setProfileImg($data['profileImg']);
        }
        if (isset($data['deleted'])) {
           $item->setDeleted($data['deleted']);
        }
        if (isset($data['hash'])) {
           $item->setHash($data['hash']);
        }
        if ($item->save()) {
          $localAdded++;
        } else {
          $result .= 'error adding trip user ' . $tripId . ' ' . $userId . '   ';
        }
      }
    } else {
      $result .= 'error getting trip user data for hash ' . $hash . ': ' .
        $rawdata . '   ';
    }
  }
  return 'TripUser: Local added: ' . $localAdded . ', Remote added: ' . $remoteAdded
    . ', message: ' . $result;
}

function synchUser($site, $authId, $remoteHashes) {
  $url = $site . '/api/synchUser.php';
  $localAdded = 0;
  $remoteAdded = 0;
  $result = '';

  $localHashes = User::getHashList();
  if ($remoteHashes) {
    $diff = array_diff($localHashes, $remoteHashes);
  } else {
    $diff = $localHashes;
  }

  // $diff contains the local entries that must be pushed
  foreach ($diff as $hash) {
    $item = User::findByHash($hash);
    if ($item) {
      $data = Array();
      $data['userId'] = $item->getUserId();
      $data['passwordHash'] = $item->getPasswordHash();
      $data['created'] = $item->getCreated();
      $data['updated'] = $item->getUpdated();
      $data['name'] = $item->getName();
      $data['externalType'] = $item->getExternalType();
      $data['externalId'] = $item->getExternalId();
      $data['access'] = $item->getAccess();
      $data['email'] = $item->getEmail();
      $data['notification'] = $item->getNotification();
      $data['tempCode'] = $item->getTempCode();
      $data['deleted'] = $item->getDeleted();
      $data['hash'] = $item->getHash();

      $opts = array('http' =>
        array(
          'method'  => 'PUT',
          'header'  => "Content-Type: application/json\r\n".
            "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
          'content' => json_encode($data),
          'timeout' => 60
        )
      );
      $context  = stream_context_create($opts);
      $putResponse = file_get_contents($url, false, $context);
      $remoteAdded++;
    }
  }

  $diff = array_diff($remoteHashes, $localHashes);
  // $diff contains the remote entries that must be obtained
  foreach ($diff as $hash) {
    $opts = array('http' =>
      array(
        'method'  => 'GET',
        'header'  => "Content-Type: application/json\r\n".
          "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
        'timeout' => 60
      )
    );
    $context  = stream_context_create($opts);
    $rawdata = file_get_contents($url . '?hash=' . urlencode($hash), false, $context);
    $data = json_decode($rawdata, true);
    if (isset($data['userId'])) {
      $item = User::findByHash($data['hash']);
      if (!$item) {
        // Don't have this hash yet, so add it
        $userId = $data['userId'];
        $item = new User($userId);
        if (isset($data['passwordHash'])) {
           $item->setPasswordHash($data['passwordHash']);
        }
        if (isset($data['created'])) {
           $item->setCreated($data['created']);
        }
        if (isset($data['updated'])) {
           $item->setUpdated($data['updated']);
        }
        if (isset($data['name'])) {
           $item->setName($data['name']);
        }
        if (isset($data['externalType'])) {
           $item->setExternalType($data['externalType']);
        }
        if (isset($data['externalId'])) {
           $item->setExternalId($data['externalId']);
        }
        if (isset($data['access'])) {
           $item->setAccess($data['access']);
        }
        if (isset($data['email'])) {
           $item->setEmail($data['email']);
        }
        if (isset($data['notification'])) {
           $item->setNotification($data['notification']);
        }
        if (isset($data['tempCode'])) {
           $item->setTempCode($data['tempCode']);
        }
        if (isset($data['deleted'])) {
           $item->setDeleted($data['deleted']);
        }
        if (isset($data['hash'])) {
           $item->setHash($data['hash']);
        }
        if ($item->save()) {
          $localAdded++;
        } else {
          $result .= 'error adding user ' . $userId . '   ';
        }
      }
    } else {
      $result .= 'error getting user data for hash ' . $hash . ': ' .
        $rawdata . '   ';
    }
  }
  return 'User: Local added: ' . $localAdded . ', Remote added: ' . $remoteAdded
    . ', message: ' . $result;
}

function synchRemoteSite($site, $password) {
  $response = successResponse();
  if (substr($site, -1) === '/') {
    $site = substr($site, 0, strlen($site) - 1);
  }

  // In order to synchronize with the remote site, first we need to login
  $url = $site . '/api/login.php';

  $data = Array();
  $data['action'] = 'login';
  $data['userId'] = SYNCH_USER;
  $data['password'] = $password;

  $opts = array('http' =>
    array(
      'method'  => 'PUT',
      'header'  => "Content-Type: application/json\r\n",
      'content' => json_encode($data),
      'timeout' => 60
    )
  );
  $context  = stream_context_create($opts);
  $loginResponse = file_get_contents($url, false, $context);

  if (!$loginResponse) {
    $response['status'] = 'ERR-SITE';
    $response['message'] = 'Could not reach remote site';
    return $response;
  }

  $loginData = json_decode($loginResponse, true);

  if ($loginData['resultCode'] === RESPONSE_NOT_FOUND) {
    $response['status'] = 'ERR-USR';
    $response['message'] = 'Synchronization user not set up';
    return $response;
  }

  if ($loginData['status'] === 'PASSWD_MISMATCH') {
    $response['status'] = 'ERR-PWD';
    $response['message'] = 'Password mismatch';
    return $response;
  }

  $authId = $loginData['authId'];

  $url = $site . '/api/synchSlave.php';
  $opts = array('http' =>
    array(
      'method'  => 'GET',
      'header'  => "Content-Type: application/json\r\n".
        "Cookie: blogAuthId=" . urlencode($authId) . "\r\n",
      'timeout' => 60
    )
  );

  $context = stream_context_create($opts);
  $raw_data = file_get_contents($url, false, $context);
  $data = json_decode($raw_data, true);
  // $response['raw-data'] = $raw_data;

  $response['synch-user'] = synchUser($site, $authId, $data['blogUser']);
  $response['synch-trip'] = synchTrip($site, $authId, $data['blogTrip']);
  $response['synch-trip-attribute'] = synchTripAttribute($site, $authId, $data['blogTripAttribute']);
  $response['synch-trip-user'] = synchTripUser($site, $authId, $data['blogTripUser']);
  $response['synch-journal'] = synchJournal($site, $authId, $data['blogJournal']);
  $response['synch-media'] = synchMedia($site, $authId, $data['blogMedia']);
  $response['synch-comment'] = synchComment($site, $authId, $data['blogComment']);
  $response['synch-feedback'] = synchFeedback($site, $authId, $data['blogFeedback']);
  // $response['data'] = $data;
  return $response;
}

function uploadLocalMedia() {
  $list = Media::getLocalMedia();
  for ($i = 0; isset($list[$i]); $i++) {
    $tripId = $list[$i]['tripId'];
    $mediaId = $list[$i]['mediaId'];
    $setId = substr($mediaId, 0, 8);
    $localFile = "/mnt/lincoln/d1/photos/$setId/large/$mediaId.jpg";
    if (file_exists($localFile)) {
      $cmd = "curl -i -X POST -F submit=1 -F fileToUpload=@$localFile http://www.grivel.net/blogphotos/sync-up-files.php";
      exec($cmd);
      $item = new Media($tripId, $mediaId);
      $item->setLocation('grivel');
      $item->save();
      echo "Set $tripId:$mediaId to grivel location\n";
    }
  }
}

$auth = new AuthB();
if (!$auth->canInitiateSynch()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isPutMethod()) {
   $data = getPostData();
   if (isset($data['site']) && isset($data['password'])
      && ($data['site'] !== '') && ($data['password'] !== '')) {
      uploadLocalMedia();
      $response = synchRemoteSite($data['site'], $data['password']);
    } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
    }
} else {
   $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED, 'must be get or put');
}

echo json_encode($response);
?>
