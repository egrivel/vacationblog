<?php

/* invoke a GET API function */
function getApi($service, $data) {
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
   $result = curl_exec($curl);
   curl_close($curl);

   return json_decode($result, true);
}

/* invoke a PUT API function */
function putApi($service, $data) {
   global $gl_api_root;
   $url = $gl_api_root . $service;

   $json = json_encode($data);

   $curl = curl_init();
   curl_setopt($curl, CURLOPT_URL, $url);
   curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PUT');
   curl_setopt($curl, CURLOPT_POSTFIELDS, $json);
   curl_setopt($curl, CURLOPT_POST, true);
   // curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
   // curl_setopt($curl, CURLOPT_VERBOSE, true);
   curl_setopt($curl, CURLOPT_HTTPHEADER,
               array(
                     'Content-Type: application/json',
                     'Content-Length:' . strlen($json))
               );
   $result = curl_exec($curl);
   curl_close($curl);
   return json_decode($result, true);
}
?>
