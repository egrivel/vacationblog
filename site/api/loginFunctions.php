<?php

define('SITE_NAME', "Vacation Blog");
define('SITE_ROOT', "https://egrivel.net/vacationblog/site/");
define('SITE_ADMIN_NAME', "Eric Grivel");

function send_notification_email($email, $subject, $text) {
    send_email($email, SITE_NAME . ": " . $subject, $text);
}

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
    . "   " . SITE_ROOT . "/#/login/conf\n"
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

function send_password_reset_email($userId, $fullname, $email, $regkey) {
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
    . "   " . SITE_ROOT . "/#/login/reset\n"
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

function send_password_change_email($userId, $fullname, $email) {
  send_email($email, SITE_NAME . " Password Change",
    "Dear $fullname,\n"
    . " \n"
    . "You are receiving this email because you have recently\n"
    . "changed your password at the " . SITE_NAME . " website.\n"
    . " \n"
    . "Registration information:\n"
    . "  User ID  : $userId\n"
    . "  Full Name: $fullname\n"
    . "  Email    : $email\n"
    . " \n"
    . "Your new password is effective immediately. If you did not change\n"
    . "your password at the " . SITE_NAME . "website, please contact the\n"
    . "website administrator immediately!\n"
    . " \n"
    . "Thank you,\n"
    . SITE_ADMIN_NAME . "\n"
    . "Website Administrator\n");
}

function send_email_change_email($userId, $fullname, $oldEmail, $newEmail,
    $regkey) {
  send_email($oldEmail, SITE_NAME . " Change Email",
    "Dear $fullname,\n"
    . " \n"
    . "You are receiving this email because you have requested\n"
    . "to change your email at the " . SITE_NAME . " website.\n"
    . " \n"
    . "Registration information:\n"
    . "  User ID  : $userId\n"
    . "  Full Name: $fullname\n"
    . "  Old Email: $oldEmail\n"
    . "  New Email: $newEmail\n"
    . " \n"
    . "You should be receiving an email at your new email address shortly\n"
    . "to complete the email change.\n"
    . "\n"
    . "If you did not request to change your email at the " . SITE_NAME . "\n"
    . "website, please contact the website administrator immediately.\n"
    . " \n"
    . "Thank you,\n"
    . SITE_ADMIN_NAME . "\n"
    . "Website Administrator\n");

  send_email($newEmail, SITE_NAME . " Change Email",
    "Dear $fullname,\n"
    . " \n"
    . "You are receiving this email because you have requested\n"
    . "to change your email at the " . SITE_NAME . " website.\n"
    . " \n"
    . "Registration information:\n"
    . "  User ID  : $userId\n"
    . "  Full Name: $fullname\n"
    . "  Old Email: $oldEmail\n"
    . "  New Email: $newEmail\n"
    . " \n"
    . "To complete the email change, please follow the instructions to\n"
    . "enter the email change confirmation code at\n"
    . "   " . SITE_ROOT . "/#/login\n"
    . "When prompted for the Confirmation Code, please enter:\n"
    . "   $regkey\n"
    . " \n"
    . "If you did not change your email at the " . SITE_NAME . "\n"
    . "website, please ignore this email.\n"
    . " \n"
    . "Thank you,\n"
    . SITE_ADMIN_NAME . "\n"
    . "Website Administrator\n");
}

?>
