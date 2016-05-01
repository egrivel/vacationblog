<?php
require_once(dirname(__FILE__) . "/../site/database/Auth.php");

/* invoke a GET API function */
function oldGetApi($service, $data, $authToken = '') {
   global $gl_api_root;
   $url = $gl_api_root . $service;
   $isFirst = true;
   foreach ($data as $key=>$value) {
      if ($isFirst) {
         $url .= '?';
         $isFirst = false;
      } else {
         $url .= '&';
      }
      $url .= urlencode($key) . '=' . urlencode($value);
   }
   $curl = curl_init();
   curl_setopt($curl, CURLOPT_URL, $url);
   curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
   curl_setopt($curl, CURLOPT_HTTPGET, 1);
   if ($authToken !== '') {
      curl_setopt($curl, CURLOPT_COOKIE,
         'blogAuthId=' . urlencode($authToken));
   }
   $result = curl_exec($curl);
   curl_close($curl);

   return json_decode($result, true);
}

function getApi($service, $data, $authToken = '') {
   $_GET = [];
   if ($data) {
      foreach ($data as $key=>$value) {
         $_GET[$key] = $value;
      }
   }

   $_COOKIE = [];
   if ($authToken !== '') {
      $_COOKIE['blogAuthId'] = $authToken;
   }

   $_SERVER['REQUEST_METHOD'] = 'GET';

   ob_start();
   include(dirname(__FILE__) . "/../site/api/" . $service);
   $output = ob_get_clean();

   return json_decode($output, true);
}

/* invoke a PUT API function */
function oldPutApi($service, $data, $authToken = '') {
   global $gl_api_root;
   $url = $gl_api_root . $service;

   $json = json_encode($data);

   $curl = curl_init();
   curl_setopt($curl, CURLOPT_URL, $url);
   curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PUT');
   curl_setopt($curl, CURLOPT_POSTFIELDS, $json);
   curl_setopt($curl, CURLOPT_POST, true);
   if ($authToken !== '') {
      curl_setopt($curl, CURLOPT_COOKIE,
         'blogAuthId=' . urlencode($authToken));
   }
   // curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
   // curl_setopt($curl, CURLOPT_VERBOSE, true);
   // curl_setopt($curl, CURLOPT_HEADER, true);
   curl_setopt($curl, CURLOPT_HTTPHEADER,
               array(
                  'Content-Type: application/json',
                  'Content-Length: ' . strlen($json)
                  )
               );
   $result = curl_exec($curl);
   curl_close($curl);
   return json_decode($result, true);
}

function putApi($service, $data, $authToken = '') {
   $_POST = [];
   if ($data) {
      foreach ($data as $key=>$value) {
         $_POST[$key] = $value;
      }
   }

   $_COOKIE = [];
   if ($authToken !== '') {
      $_COOKIE['blogAuthId'] = $authToken;
   }

   $_SERVER['REQUEST_METHOD'] = 'PUT';

   ob_start();
   include(dirname(__FILE__) . "/../site/api/" . $service);
   $output = ob_get_clean();

   return json_decode($output, true);
}

function setupOneToken($userId, $level, $token) {
   if (!isset($token)) {
      // Clean up from previous tests
      $query = "DELETE FROM blogUser "
         . " WHERE userId='$userId'";
      mysql_query($query);

      $query = "DELETE FROM blogAuth "
         . " WHERE userId='$userId'";
      mysql_query($query);

      $user = new User($userId);
      $user->setAccess($level);
      $user->save();

      $token = Auth::generateAuthId();
      $auth = new Auth($token);
      $auth->setUserId($userId);
      $auth->save();
   }
   return $token;
}

function setupTokens() {
   global $visitorAuthToken, $contribAuthToken;
   global $adminAuthToken, $synchAuthToken;

   $visitorUser = '-test-user-visitor';
   $contribUser = '-test-user-contrib';
   $adminUser = '-test-user-admin';
   $synchUser = '-test-user-synch';

   $visitorAuthToken = setupOneToken($visitorUser,
      LEVEL_VISITOR, $visitorAuthToken);
   $contribAuthToken = setupOneToken($contribUser,
      LEVEL_CONTRIB, $contribAuthToken);
   $adminAuthToken = setupOneToken($adminUser,
      LEVEL_ADMIN, $adminAuthToken);
   $synchAuthToken = setupOneToken($synchUser,
      LEVEL_SYNCH, $synchAuthToken);
}
?>
