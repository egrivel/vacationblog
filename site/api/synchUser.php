<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/User.php');

$auth = new AuthB();
if (!$auth->canSynchUser()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isGetMethod()) {
   if (isset($_GET['hash'])) {
      $hash = $_GET['hash'];
      if ($hash === '') {
         $response = errorResponse(RESPONSE_BAD_REQUEST, 'Need hash');
      } else {
         $object = User::findByHash($hash);
         if ($object === null) {
            $response = errorResponse(RESPONSE_NOT_FOUND);
         } else {
            $response = successResponse();
            $response['userId'] = $object->getUserId();
            $response['passwordHash'] = $object->getPasswordHash();
            $response['created'] = $object->getCreated();
            $response['updated'] = $object->getUpdated();
            $response['name'] = $object->getName();
            $response['externalType'] = $object->getExternalType();
            $response['externalId'] = $object->getExternalId();
            $response['access'] = $object->getAccess();
            $response['email'] = $object->getEmail();
            $response['notification'] = $object->getNotification();
            $response['tempCode'] = $object->getTempCode();
            $response['tempEmail'] = $object->getTempEmail();
            $response['tempEmailCode'] = $object->getTempEmailCode();
            $response['deleted'] = $object->getDeleted();
            $response['hash'] = $object->getHash();
         }
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST, 'Need hash');
   }
} else if (isPutMethod()) {
   $data = getPostData();
   if (isset($data['userId']) && ($data['userId'] !== '')) {
      $userId = $data['userId'];
      $object = new User($userId);
      if (isset($data['passwordHash'])) {
         $object->setPasswordHash($data['passwordHash']);
      }
      if (isset($data['created'])) {
         $object->setCreated($data['created']);
      }
      if (isset($data['updated'])) {
         $object->setUpdated($data['updated']);
      }
      if (isset($data['name'])) {
         $object->setName($data['name']);
      }
      if (isset($data['externalType'])) {
         $object->setExternalType($data['externalType']);
      }
      if (isset($data['externalId'])) {
         $object->setExternalId($data['externalId']);
      }
      if (isset($data['access'])) {
         $object->setAccess($data['access']);
      }
      if (isset($data['email'])) {
         $object->setEmail($data['email']);
      }
      if (isset($data['notification'])) {
         $object->setNotification($data['notification']);
      }
      if (isset($data['tempCode'])) {
         $object->setTempCode($data['tempCode']);
      }
      if (isset($data['tempEmail'])) {
         $object->setTempCode($data['tempEmail']);
      }
      if (isset($data['tempEmailCode'])) {
         $object->setTempCode($data['tempEmailCode']);
      }
      if (isset($data['deleted'])) {
         $object->setDeleted($data['deleted']);
      }
      if (isset($data['hash'])) {
         $object->setHash($data['hash']);
      }
      if ($object->save()) {
         $response = successResponse();
      } else {
         $response = errorResponse(RESPONSE_INTERNAL_ERROR);
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST, 'Need user ID');
   }
} else {
   $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED);
}

echo json_encode($response);
?>
