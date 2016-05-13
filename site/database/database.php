<?php
  /* ============================================================ */
  /* Database functions                                           */
  /* module prefix: "db_".                                        */
  /* ============================================================ */
  // Prerequisites
$gl_db_init = false;

function db_init() {
   global $gl_db_init;
   global $gl_db_system;
   if (!$gl_db_init) {
      $config = parse_ini_file(dirname(__FILE__) . '/../../vacationblog.ini');
      if (isset($_ENV["OPENSHIFT_MYSQL_DB_HOST"])) {
        $hostname = $_ENV["OPENSHIFT_MYSQL_DB_HOST"];
      } else {
        $hostname = $config['hostname'];
      }
      if (isset($_ENV["OPENSHIFT_MYSQL_DB_USERNAME"])) {
        $username = $_ENV["OPENSHIFT_MYSQL_DB_USERNAME"];
      } else {
        $username = $config['username'];
      }
      if (isset($_ENV['OPENSHIFT_MYSQL_DB_PASSWORD'])) {
        $password = $_ENV['OPENSHIFT_MYSQL_DB_PASSWORD'];
      } else {
        $password = $config['password'];
      }
      if (isset($_ENV['OPENSHIFT_GEAR_NAME'])) {
        $dbname = $_ENV['OPENSHIFT_GEAR_NAME'];
      } else {
        $dbname = $config('dbname');
      }
      echo "Connect to $hostname as $username with password $password<br/>\n";
      mysql_connect($hostname, $username, $password);
      mysql_selectdb($dbname);

      $gl_db_init = true;
   }
}

/*
 * db_sql_encode(): call before storing data in the SQL database. This
 * function will make sure the data is properly quoted and will escape
 * special characters. This includes adding quotes around the value.
 */
function db_sql_encode($value) {
   if (!isset($value) || ($value === null)) {
      return "null";
   }
   $value = str_replace("&", "&amp;", $value);
   $value = str_replace("'", "&apos;", $value);
   $value = str_replace("\n", "&nl;", $value);
   $value = str_replace("\r", "&lf;", $value);
   return "'".$value."'";
}

/*
 * db_sql_decode(): call when retrieving data from the SQL database. This
 * function will take place of the un-escaping of special characters.
 * Any quotes around the value will be removed.
 */
function db_sql_decode($value) {
   if (!isset($value) || ($value === null) || ($value === "null")) {
      return null;
   }
   if (substr($value, 0, 1) === "'") {
      $value = substr($value, 1);
   }
   if (substr($value, -1) === "'") {
      $value = substr($value, 0, -1);
   }
   $value = str_replace("&lf;", "\r", $value);
   $value = str_replace("&nl;", "\n", $value);
   $value = str_replace("&apos;", "'", $value);
   $value = str_replace("&amp;", "&", $value);
   return $value;
}

/*
 * db_sql_recode(): call when using values retrieved from the database (or
 * previously encoded) in a subsequent SQL call.
 */
function db_sql_recode($value) {
    return db_sql_encode(db_sql_decode($value));
}

/* Always init database when this module is loaded */
db_init();

?>
