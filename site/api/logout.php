<?php
/**
 * call to log into the system
 */

include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Auth.php');
include_once(dirname(__FILE__) . '/../database/User.php');

if (isGetMethod()) {
   $authId = $_COOKIE['blogAuthId'];
   if (isset($authId) && ($authId !== '')) {
      $auth = new Auth($authId);
      $auth->delete();
   }
   $response = successResponse();
} else {
  $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED, $_SERVER['REQUEST_METHOD']);
}

echo json_encode($response);
?>
