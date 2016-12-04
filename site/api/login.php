<?php
/**
 * call to log into the system
 */

include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Auth.php');
include_once(dirname(__FILE__) . '/../database/User.php');

define('SITE_NAME', "Vacation Blog");
define('SITE_ROOT', "https://vacationblog-egrivel.rhcloud.com");
define('SITE_ADMIN_NAME', "Eric Grivel");


function send_conf_email($userid, $fullname, $email, $regkey) {
   send_email($email, SITE_NAME . " Website Registration",
    "Dear $fullname,\n"
    . " \n"
    . "You are receiving this email because you started\n"
    . "registration at the " . SITE_NAME . " website.\n"
    . " \n"
    . "Registration information:\n"
    . "  User ID  : $userid\n"
    . "  Full Name: $fullname\n"
    . "  Email    : $email\n"
    . "  Password : **********\n"
    . " \n"
    . "To complete the registration process, please log in on the\n"
    . "website using the user ID and password you selected.\n"
    . "   " . SITE_ROOT . "/#/login\n"
    . "When prompted for the Confirmation Code, please enter:\n"
    . "   $regkey\n"
    . " \n"
    . "If you did not start registration at the " . SITE_NAME . "\n"
    . "website, please ignore this email.\n"
    . " \n"
    . "Thank you,\n"
    . SITE_ADMIN_NAME . "\n"
    . "Website Administrator\n");
}

function send_user_id_email($userId, $fullname, $email) {
  send_email($email, SITE_NAME . " Retrieve User ID",
    "Dear $fullname,\n"
    . " \n"
    . "You are receiving this email because you want to be reminded of\n"
    . "your user ID at the " . SITE_NAME . " website.\n"
    . " \n"
    . "Registration information:\n"
    . "  User ID  : $userId\n"
    . "  Full Name: $fullname\n"
    . "  Email    : $email\n"
    . "  Password : **********\n"
    . " \n"
    . "If you do not know the password, please use the password reset\n"
    . "function on the website to establish a new password. Your password\n"
    . "is stored securely, even we cannot retrieve it.\n"
    . " \n"
    . "Thank you,\n"
    . SITE_ADMIN_NAME . "\n"
    . "Website Administrator\n");
}

function send_password_email($userId, $fullname, $email, $regkey) {
  send_email($email, SITE_NAME . " Reset Password",
    "Dear $fullname,\n"
    . " \n"
    . "You are receiving this email because you have requested\n"
    . "to reset your password at the " . SITE_NAME . " website.\n"
    . " \n"
    . "Registration information:\n"
    . "  User ID  : $userId\n"
    . "  Full Name: $fullname\n"
    . "  Email    : $email\n"
    . " \n"
    . "To complete the password reset, please follow the instructions to\n"
    . "enter the password reset confirmation code at\n"
    . "   " . SITE_ROOT . "/#/login\n"
    . "When prompted for the Confirmation Code, please enter:\n"
    . "   $regkey\n"
    . " \n"
    . "If you did not request a password reset at the " . SITE_NAME . "\n"
    . "website, please ignore this email.\n"
    . " \n"
    . "Thank you,\n"
    . SITE_ADMIN_NAME . "\n"
    . "Website Administrator\n");
}

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
      if (($user->getCreated() === null)
        || ($user->getDeleted() === 'Y')) {
        $response = errorResponse(RESPONSE_NOT_FOUND);
        $response['status'] = 'USERID_NOT_FOUND';
      } else {
        if ($user->checkPassword($password)) {
          // password matches, need to allow for hash update (if hash
          // algorithm changed, the new hash can only be stored in the
          // database when we have the actual password, and only at login
          // time do we have the actual password)
          $user->updatePasswordHash($password);
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
    $email = '';
    if (isset($data['email'])) {
      $email = $data['email'];
    }
    if (($userId === '') && ($email === '')) {
      // need either user ID or email
      $response = errorResponse(RESPONSE_BAD_REQUEST);
      $response['status'] = 'MISSING_DATA';
    } else if ($userId !== '') {
      $user = new User($userId);
      if (($user->getCreated() === null)
        || ($user->getDeleted() === 'Y')) {
        $response = errorResponse(RESPONSE_NOT_FOUND);
        $response['status'] = 'USERID_NOT_FOUND';
      } else {
        $email = $user->getEmail();
        $name = $user->getName();
        $tempCode = random_string();
        $user->setTempCode($tempCode);
        $user->save();
        send_password_email($userId, $name, $email, $tempCode);
        $response = successResponse();
        $response['status'] = 'OK';
      }
    } else if ($email !== '') {
      $user = User::findByEmail($email);
      if (!$user
        || ($user->getCreated() === null)
        || ($user->getDeleted() === 'Y')) {
        $response = errorResponse(RESPONSE_NOT_FOUND);
        $response['status'] = 'EMAIL_NOT_FOUND';
      } else {
        $name = $user->getName();
        $userId = $user->getUserId();
        send_user_id_email($userId, $name, $email);
        $response = successResponse();
        $response['status'] = 'OK';
      }
    } else {
      // should not be possible
      $response = errorResponse(RESPONSE_BAD_REQUEST);
      $response['status'] = 'MISSING_DATA';
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
