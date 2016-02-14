<?php
/* Set global variables and include the common functions.         */
/* Note: this file (common.php) is included in every test file to */
/* set the global variables again, but the functions should be    */
/* declared only once, so they are included separately.           */
$gl_test_root = dirname(__FILE__);
$gl_site_root = dirname(__FILE__) . "/../site";
$config = parse_ini_file(dirname(__FILE__) . '/../vacationblog.ini');
$gl_api_root = $config['apiroot'];

include_once("$gl_test_root/common_functions.php");
?>
