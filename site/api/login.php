<?php
/**
 * call to log into the system
 */

include_once(dirname(__FILE__) . '/../common/common.php');
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Auth.php');
include_once(dirname(__FILE__) . '/../database/User.php');
include_once(dirname(__FILE__) . '/loginFunctions.php');

if (isPutMethod()) {
  $data = getPostData();
  $action = '';
  if (isset($data['action'])) {
    $action = $data['action'];
  }
  if ($action === 'login') {
    $userId = '';
    if (isset($data['userId'])) {
      $userId = $data['userId'];
    }
    $password = '';
    if (isset($data['password'])) {
      $password = $data['password'];
    }
    if (($userId === '') || ($password === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
      $response['status'] = 'MISSING_DATA';
    } else {
      $user = new User($userId);
      if ($user->getCreated() === null) {
        $user->loadByEmail($userId);
      }
      if (($user->getCreated() === null)
        || ($user->getDeleted() === 'Y')) {
        $response = errorResponse(RESPONSE_NOT_FOUND);
        $response['status'] = 'USERID_NOT_FOUND: ' . $userId;
      } else {
        if ($user->checkPassword($password)) {
          // password matches, need to allow for hash update (if hash
          // algorithm changed, the new hash can only be stored in the
          // database when we have the actual password, and only at login
          // time do we have the actual password)
          $user->updatePasswordHash($password);
          $userId = $user->getUserId();
          if ($user->getAccess() === 'temp') {
            // User logged in but only has temp access. Don't generate an
            // authentication token.
            $response = errorResponse(RESPONSE_UNAUTHORIZED);
            $response['status'] = 'TEMP_USER';
          } else {
            if ($user->getTempCode() !== '') {
              // After a successful login, the temp code is no longer valid
              $user->setTempCode('');
              $user->save();
            }
            $authId = Auth::generateAuthId();
            $auth = new Auth($authId);
            $auth->setUserId($userId);
            $auth->save();
            $response = successResponse();
            $response['authId'] = $authId;
            $response['status'] = 'OK';
            $response['userId'] = $userId;
          }
        } else {
          $response = errorResponse(RESPONSE_UNAUTHORIZED);
          $response['status'] = 'PASSWD_MISMATCH';
        }
      }
    }
  } else if ($action === 'register') {
    $userId = '';
    if (isset($data['userId'])) {
      $userId = $data['userId'];
    }
    $name = '';
    if (isset($data['name'])) {
      $name = $data['name'];
    }
    $email = '';
    if (isset($data['email'])) {
      $email = $data['email'];
    }
    $password = '';
    if (isset($data['password'])) {
      $password = $data['password'];
    }
    $notification = '';
    if (isset($data['notification'])) {
      $notification = $data['notification'];
    }
    if (($userId === '') || ($name === '') ||
      ($email === '') || ($password === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
      $response['status'] = 'MISSING_DATA';
    } else {
      // Check if user or email already exists. Note: if user ID or email
      // exists for a "temp" user, re-registration is allowed?
      $user = new User($userId);
      if (($user->getCreated() !== null)
        && ($user->getDeleted() !== 'Y')
        && ($user->getAccess() !== 'temp')) {
        // user ID already exists
        $response = errorResponse(RESPONSE_BAD_REQUEST);
        $response['status'] = 'USERID_EXISTS';
      } else {
        $emailUser = User::findByEmail($email);
        if ($emailUser && ($emailUser->getAccess() !== 'temp')) {
          $response = errorResponse(RESPONSE_BAD_REQUEST);
          $response['status'] = 'EMAIL_EXISTS';
        } else {
          $tempCode = random_string();
          $user->setName($name);
          $user->setPassword($password);
          $user->setEmail($email);
          $user->setAccess('temp');
          $user->setNotification($notification);
          $user->setTempCode($tempCode);
          if ($user->save()) {
            send_conf_email($userId, $name, $email, $tempCode);
            $response = successResponse();
            $response['status'] = 'OK';
            $response['tempCode'] = $tempCode;
          } else {
            $response = errorResponse(RESPONSE_INTERNAL_ERROR);
          }
        }
      }
    }
  } else if ($action === 'retrieve') {
    $userId = '';
    if (isset($data['userId'])) {
      $userId = $data['userId'];
    }
    if ($userId === '') {
      // need either user ID or email
      $response = errorResponse(RESPONSE_BAD_REQUEST);
      $response['status'] = 'MISSING_DATA';
    } else {
      if (strpos($userId, '@') === false) {
        // must be a user ID
        $user = new User($userId);
      } else {
        $user = User::findByEmail($userId);
      }
      if (($user->getCreated() === null)
        || ($user->getDeleted() === 'Y')) {
        $response = errorResponse(RESPONSE_NOT_FOUND);
        $response['status'] = 'USERID_NOT_FOUND';
      } else {
        $userId = $user->getUserId();
        $email = $user->getEmail();
        $name = $user->getName();
        $tempCode = random_string();
        $user->setTempCode($tempCode);
        $user->save();
        send_password_reset_email($userId, $name, $email, $tempCode);
        $response = successResponse();
        $response['status'] = 'OK';
      }
    }
  } else if ($action === 'confirm') {
    $userId = '';
    if (isset($data['userId'])) {
      $userId = $data['userId'];
    }
    $confCode = '';
    if (isset($data['confCode'])) {
      $confCode = $data['confCode'];
    }
    if (($userId === '') || ($confCode === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
      $response['status'] = 'MISSING_DATA';
    } else {
      $user = new User($userId);
      if (($user->getCreated() === null)
        || ($user->getDeleted() === 'Y')) {
        $response = errorResponse(RESPONSE_NOT_FOUND);
        $response['status'] = 'USERID_NOT_FOUND';
      } else {
        $tempCode = $user->getTempCode();
        if ($confCode !== $tempCode) {
          $response = errorResponse(RESPONSE_UNAUTHORIZED);
          $response['status'] = 'CONF_MISMATCH';
        } else {
          // User correctly provided their confirmation code. If they had temp
          // access, they now get full access.
          $access = $user->getAccess();
          if ($access === 'temp') {
            $user->setAccess('visitor');
          }
          $user->setTempCode('');
          $user->save();
          $response = successResponse();
          $response['status'] = 'OK';
        }
      }
    }
  } else if ($action === 'confirm-pwd') {
    $userId = '';
    if (isset($data['userId'])) {
      $userId = $data['userId'];
    }
    $confCode = '';
    if (isset($data['confCode'])) {
      $confCode = $data['confCode'];
    }
    $password = '';
    if (isset($data['password'])) {
      $password = $data['password'];
    }
    if (($userId === '') || ($confCode === '') || ($password === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
      $response['status'] = 'MISSING_DATA';
    } else {
      $user = new User($userId);
      if ($user->getCreated() === null) {
        $user->loadByEmail($userId);
      }
      if (($user->getCreated() === null)
        || ($user->getDeleted() === 'Y')) {
        $response = errorResponse(RESPONSE_NOT_FOUND);
        $response['status'] = 'USERID_NOT_FOUND';
      } else {
        $tempCode = $user->getTempCode();
        if ($confCode !== $tempCode) {
          $response = errorResponse(RESPONSE_UNAUTHORIZED);
          $response['status'] = 'CONF_MISMATCH';
        } else {
          // User correctly provided their confirmation code. If they had temp
          // access, they now get full access.
          $access = $user->getAccess();
          if ($access === 'temp') {
            // Can't do a password reset with temp access
            $response = errorResponse(RESPONSE_UNAUTHORIZED);
            $response['status'] = 'TEMP_USER';
          } else {
            $user->setTempCode('');
            $user->setPassword($password);
            $user->save();
            $response = successResponse();
            $response['status'] = 'OK';
          }
        }
      }
    }
  } else {
    $message = 'Unrecognized action ' + $action;
    $response = errorResponse(RESPONSE_BAD_REQUEST, $message);
  }
} else {
  $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED, $_SERVER['REQUEST_METHOD']);
}

echo json_encode($response);
?>
