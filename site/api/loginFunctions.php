<?php

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

?>
