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
define('CO_SYSTEM_TRUMAN',     "E");

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
      } else if (file_exists("/etc/system/truman")) {
         // On the "Truman" laptop
         $gl_co_system = CO_SYSTEM_TRUMAN;
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

function getPostData() {
   if (count($_POST)) {
      return $_POST;
   } else {
      return json_decode(file_get_contents('php://input'), true);
   }
}

define("RESPONSE_SUCCESS", '200');
define("RESPONSE_BAD_REQUEST", '400');
define("RESPONSE_UNAUTHORIZED", '401');
define("RESPONSE_NOT_FOUND", '404');
define("RESPONSE_METHOD_NOT_ALLOWED", '405');
define("RESPONSE_INTERNAL_ERROR", '500');

function errorResponse($code, $info = '') {
   if ($info !== '') {
      $info = ': ' . $info;
   }
   switch ($code) {
   case RESPONSE_BAD_REQUEST:
      return createResponse($code,
         'Bad Request (Invalid parameter)' . $info);
   case RESPONSE_UNAUTHORIZED:
      return createResponse($code, 'Unauthorized' . $info);
   case RESPONSE_NOT_FOUND:
      return createResponse($code, 'Not found' . $info);
   case RESPONSE_METHOD_NOT_ALLOWED:
      return createResponse($code, 'Method not allowed' . $info);
   case RESPONSE_INTERNAL_ERROR:
      return createResponse($code, 'Internal error' . $info);
   default:
      return createResponse($code, 'Unknown Code' . $info);
   }
}

function successResponse() {
   return createResponse(RESPONSE_SUCCESS, 'OK');
}

/*
 * Return a random string as a temporary code. The string is carefully
 * created to contain only certain characters which cannot be easily
 * confused with similar-lookng characters.
 */
function random_string() {
    $str = "";
    $set = "ACDEFGHJKLMNPRSTVXYabcdefghijkmnoprstvwz3457";
    for ($i = 0; $i < 5; $i++){
        $pos = rand(0, strlen($set));
        $str .= substr($set, $pos, 1);
    }
    return $str;
}

function send_email($to, $subject, $message) {
  // use the acm.org account as the From: value, otherwise gmail won't
  // deliver...
  $from = "vacationblog@grivel.net";
  $reply_to = "vacationblog@grivel.net";
  $xheaders = "";
  $xheaders .= "From: <$from>\n";
  $xheaders .= "X-Mailer: PHP\n"; // mailer
  $xheaders .= "Reply-To: <$reply_to>\n";
  $xheaders .= "Content-Type:text/plain; charset=\"iso-8859-1\"\n"; //.......
  mail($to, $subject, $message, $xheaders, "-f $from");
}


?>
