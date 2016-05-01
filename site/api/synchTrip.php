<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');

$auth = new AuthB();
if (!$auth->canSynchTrip()) {
   $response = errorResponse(REPONSE_UNAUTHORIZED);
} else if (isGetMethod()) {
   if (isset($_GET['hash'])) {
      $hash = $_GET['hash'];
      if ($hash === '') {
         $response = errorResponse(RESPONSE_BAD_REQUEST, 'Empty hash');
      } else {
         $trip = Trip::findByHash($hash);
         if ($trip === null) {
            $response = errorResponse(RESPONSE_NOT_FOUND);
         } else {
            $response = successResponse();
            $response['tripId'] = $trip->getTripId();
            $response['created'] = $trip->getCreated();
            $response['updated'] = $trip->getUpdated();
            $response['name'] = $trip->getName();
            $response['description'] = $trip->getDescription();
            $response['bannerImg'] = $trip->getBannerImg();
            $response['startDate'] = $trip->getStartDate();
            $response['endDate'] = $trip->getEndDate();
            $response['active'] = $trip->getActive();
            $response['deleted'] = $trip->getDeleted();
            $response['hash'] = $trip->getHash();
         }
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST, 'Missing hash');
   }
} else if (isPutMethod()) {
   $contents = file_get_contents('php://input');
   $data = json_decode($contents, true);
   if (isset($data['tripId']) && ($data['tripId'] !== '')) {
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
         $response = successResponse();
      } else {
         $response = errorResponse(RESPONSE_INTERNAL_ERROR);
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST, 'Missing tripId');
   }
} else {
   $response = errorResponse(RESPONSE_BAD_REQUEST, 'Not GET or PUT');
}

echo json_encode($response);
?>
