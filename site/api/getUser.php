<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/User.php');

$auth = new AuthB();
if (!$auth->canGetUser()) {
   $response = errorResponse(RESPONSE_NOT_ALLOWED);
} else {
   $userId = '';
   if (isset($_GET['userId'])) {
      $userId = $_GET['userId'];
   }
   
   if (!isset($userId) || ($userId === '')) {
      $response = errorResponse(RESPONSE_INVALID_PARAM);
   } else {
      $object = new User($userId);
      if ($object->getCreated() === null) {
         $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
         $response = successResponse();
         $response['userId'] = $object->getUserId();
         $response['created'] = $object->getCreated();
         $response['updated'] = $object->getUpdated();
         $response['name'] = $object->getName();
         $response['externalType'] = $object->getExternalType();
         $response['externalId'] = $object->getExternalId();
         $response['access'] = $object->getAccess();
         $response['email'] = $object->getEmail();
         $response['notification'] = $object->getNotification();
         $response['tempCode'] = $object->getTempCode();
         $response['deleted'] = $object->getDeleted();
      }
   }
}
echo json_encode($response);
?>
