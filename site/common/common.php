<?php

/* ============================================================ */
/* Common functionality                                         */
/* module prefix: "co_".                                        */
/* ============================================================ */

$gl_co_system = "";

/* Constants for system names */
define('CO_SYSTEM_WASHINGTON', "A");
define('CO_SYSTEM_PUBLIC',     "B");
define('CO_SYSTEM_JEFFERSON',  "C");
define('CO_SYSTEM_LINCOLN',    "D");

function co_get_system() {
   global $gl_co_system;
   if ($gl_co_system == "") {
      if (file_exists("/etc/system/jefferson")) {
         // On the "Jefferson" laptop
         $gl_co_system = CO_SYSTEM_JEFFERSON;
      } else if (file_exists("/etc/system/washington")) {
         // On the "Washington" server at home
         $gl_co_system = CO_SYSTEM_WASHINGTON;
      } else if (file_exists("/etc/system/lincoln")) {
         // On the "Lincoln" laptop
         $gl_co_system = CO_SYSTEM_LINCOLN;
      } else {
         // Connect to the database on the public system
         $gl_co_system = CO_SYSTEM_PUBLIC;
      }
   }
   return $gl_co_system;
}

/**
 * Get a new unique ID. The value returned is sufficiently random that it
 * is very, very unlikely that the same ID would be generated twice, even
 * on different systems.
 * IDs are 32 characters in this system, which is why the length of the
 * return value is limited to 32 characters.
 * This code is based on the function in the comments on the PHP manual,
 * see http://php.net/manual/en/function.com-create-guid.php#52354
 * but with the '{', '}' and hyphens stripped out, so it's basically
 * a 32-character hash function
 */
function co_get_uid(){
   $uuid = strtolower(md5(uniqid(rand(), true)));
   return substr($uuid, 0, 32);
}

function isGetMethod() {
   return strtolower($_SERVER['REQUEST_METHOD']) === 'get';
}

function isPutMethod() {
   return strtolower($_SERVER['REQUEST_METHOD']) === 'put';
}

function createResponse($code, $message) {
   return array('resultCode'=>$code, 'resultMessage'=>$message);
}

define("RESPONSE_SUCCESS", '200');
define("RESPONSE_INVALID_PARAM", '401');
define("RESPONSE_NOT_ALLOWED", '403');
define("RESPONSE_NOT_AUTHORIZED", '403');
define("RESPONSE_NOT_FOUND", '404');
define("RESPONSE_INTERNAL_ERROR", '500');

function errorResponse($code, $info = '') {
   if ($info !== '') {
      $info = ': ' . $info;
   }
   switch ($code) {
   case RESPONSE_NOT_AUTHORIZED:
      return createResponse($code, 'Not Authorized' . $info);
   case RESPONSE_NOT_FOUND:
      return createResponse($code, 'Not found' . $info);
   case RESPONSE_INVALID_PARAM:
      return createResponse($code, 'Invalid parameter' . $info);
   default:
      return createResponse($code, 'Unknown Code' . $info);
   }
}

function successResponse() {
   return createResponse('200', 'OK');
}

?>
