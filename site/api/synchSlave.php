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
include_once(dirname(__FILE__) . "/../database/Trip.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');

$auth = new AuthB();

if (!$auth->canSynch()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isGetMethod()) {
   // Need to respond with a list of all hashes
   $response = successResponse();
   $response['blogTrip'] = Trip::getHashList();
} else {
   $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED, 'must be get or put');
}

echo json_encode($response);
?>
