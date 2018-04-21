<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/User.php');

$auth = new AuthB();

$userId = '';
if (isset($_GET['userId'])) {
   $userId = $_GET['userId'];
} else {
   $userId = $auth->getUserId();
   if (!$userId) {
      $userId = '';
   }
}

if (!isset($userId) || ($userId === '')) {
   $response = errorResponse(RESPONSE_BAD_REQUEST, 'Need user ID');
} else {
   if (!$auth->canGetUserBaseInfo($userId)) {
      $response = errorResponse(RESPONSE_UNAUTHORIZED);
   } else {
      $object = new User($userId);
      if ($object->getCreated() === null) {
         $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
         $response = successResponse();
         $response['userId'] = $object->getUserId();
         $response['name'] = $object->getName();
         $response['externalType'] = $object->getExternalType();
         $response['deleted'] = $object->getDeleted();
         if ($auth->canGetUserDetails($userId)) {
            $response['created'] = $object->getCreated();
            $response['updated'] = $object->getUpdated();
            $response['externalId'] = $object->getExternalId();
            $response['access'] = $object->getAccess();
            $response['email'] = $object->getEmail();
            $response['notification'] = $object->getNotification();
            $response['tempCode'] = $object->getTempCode();
         }
      }
   }
}
echo json_encode($response);
?>
