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
include_once(dirname(__FILE__) . '/../database/User.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');

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
    $data = file_get_contents($url . '?hash=' . urlencode($hash), false, $context);
    $data = json_decode($data, true);
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
      $result .= 'error getting data for hash ' . $hash . '   ';
    }
  }
  return 'Local added: ' . $localAdded . ', Remote added: ' . $remoteAdded
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
  $response['raw-data'] = $raw_data;

  $response['synch-result'] = synchTrip($site, $authId, $data['blogTrip']);
  $response['data'] = $data;
  return $response;
}

$auth = new AuthB();
if (!$auth->canInitiateSynch()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isPutMethod()) {
   $data = getPostData();
   if (isset($data['site']) && isset($data['password'])
      && ($data['site'] !== '') && ($data['password'] !== '')) {
      $response = synchRemoteSite($data['site'], $data['password']);
    } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
    }
} else {
   $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED, 'must be get or put');
}

echo json_encode($response);
?>
