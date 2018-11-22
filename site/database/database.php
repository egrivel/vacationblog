<?php
  /* ============================================================ */
  /* Database functions                                           */
  /* module prefix: "db_".                                        */
  /* ============================================================ */
  // Prerequisites
$gl_db_init = false;

$gl_db_version = '';

function db_get_ini_file($root) {
   if (file_exists("$root/../../../private/vacationblog.ini")) {
      // First handle the situation that the vacationblog is in a
      // sub-subdirectory, so have to move three levels up from the
      // vacationblog root to find the "private" area.
      return "$root/../../../private/vacationblog.ini";
   }
   if (file_exists("$root/../../../vacationblog.ini")) {
      // If there is no "private" area, then at least store it outside
      // of the web server contents
      return "$root/../../../vacationblog.ini";
   }
   
   if (file_exists("$root/../../private/vacationblog.ini")) {
      // Then handle the situation that the vacationblog is in a
      // subdirectory, so have to move two levels up from the vacationblog
      // root to find the "private" area.
      return "$root/../../private/vacationblog.ini";
   }
   if (file_exists("$root/../../vacationblog.ini")) {
      // If there is no "private" area, then at least store it outside
      // of the web server contents
      return "$root/../../vacationblog.ini";
   }
   
   if (file_exists("$root/../private/vacationblog.ini")) {
      // Now handle the situation where the vacationblog is in the root
      // of the web server.
      return "$root/../private/vacationblog.ini";
   }
   if (file_exists("$root/../vacationblog.ini")) {
      // If there is no "private" area, then at least store it outside
      // of the web server contents
      return "$root/../vacationblog.ini";
   }
   
   // If all else fails, store it in the web server content root
   // (but make sure it's protected with a .htaccess file)
   return "$root/vacationblog.ini";
}

function db_init() {
   global $gl_db_init;
   global $gl_db_version;
   
   if (!$gl_db_init) {
      // root directory of the vacationblog system (may not be the root of
      // the whole web server)
      $root = dirname(__FILE__) . '/../..';
      $config_fname = db_get_ini_file($root);
      $config = parse_ini_file($config_fname);
      if (isset($_ENV['DB_NAME'])) {
        $dbname = $_ENV['DB_NAME'];
      } else {
        $dbname = $config['dbname'];
      }
      if (isset($_ENV['DB_HOST']) && isset($_ENV['DB_PORT'])) {
        $hostname = $_ENV['DB_HOST'] . ':' . $_ENV['DB_PORT'];
      } else if (isset($_ENV['DB_HOST'])) {
        $hostname = $_ENV['DB_HOST'];
      } else {
        $hostname = $config['hostname'];
      }
      if (isset($_ENV['DB_USERNAME'])) {
        $username = $_ENV['DB_USERNAME'];
      } else {
        $username = $config['username'];
      }
      if (isset($_ENV['DB_PASSWORD'])) {
        $password = $_ENV['DB_PASSWORD'];
      } else {
        $password = $config['password'];
      }
      // echo "Connect to $hostname as $username with password $password<br/>\n";
      // echo "dbname = '$dbname'<br/>\n";

      if ($dbname === 'egrivel_blog') {
         $gl_db_version = 'mysql-5.7';
      }
      if (!db_connect($hostname, $username, $password, $dbname)) {
        echo "Could not connect: '" . db_error() . "'<br/>\n";
      }
      // mysql_selectdb($dbname);

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

/*
 * Some SQL constructs are version-dependent. Return the correct
 * syntax depending on the version.
 */
function db_get_installed_version() {
   global $gl_db_version;
  if (isset($_ENV['DB_VERSION'])) {
    return $_ENV['DB_VERSION'];
  }
  return $gl_db_version;
}
function db_get_create_default() {
  $version = db_get_installed_version();
  if ($version === 'mysql-5.7') {
    return 'CURRENT_TIMESTAMP(6)';
  } else {
    return '\'0000-00-00 00:00:00\'';
  }
}

function db_get_created_sql() {
  $version = db_get_installed_version();
  if ($version === 'mysql-5.7') {
    return 'created TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6), ';
  } else {
    return 'created TIMESTAMP DEFAULT \'0000-00-00 00:00:00\', ';
  }
}

function db_get_update_default() {
  $version = db_get_installed_version();
  if ($version === 'mysql-5.7') {
    return 'CURRENT_TIMESTAMP(6)';
  } else {
    return 'CURRENT_TIMESTAMP';
  }
}

function db_get_updated_sql() {
  $version = db_get_installed_version();
  if ($version === 'mysql-5.7') {
    return 'updated TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6), ';
  } else {
    return 'updated TIMESTAMP DEFAULT \'0000-00-00 00:00:00\', ';
  }
}

function db_created($value) {
  $version = db_get_installed_version();
  if ($value) {
    if ($value === '0000-00-00 00:00:00') {
      $local = db_sql_encode($value);
    } else {
      // Convert the timestamp, which is provided in UTC, to local time,
      // which is what mySQL is expecting as input
      $local = "CONVERT_TZ('$value','+00:00','SYSTEM')";
    }
    return ", created=$local";
  } else if ($version === 'mysql-5.7') {
    return '';
  } else {
    return ', created=null';
  }
}

function db_updated($value) {
  $version = db_get_installed_version();
  if ($value) {
    if ($value === '0000-00-00 00:00:00') {
      $local = db_sql_encode($value);
    } else {
      // Convert the timestamp, which is provided in UTC, to local time,
      // which is what mySQL is expecting as input
      $local = "CONVERT_TZ('$value','+00:00','SYSTEM')";
    }
    return ", updated=$local";
  } else if ($version === 'mysql-5.7') {
    return '';
  } else {
    return ', updated=null';
  }
}

global $db_link;

function db_connect($hostname, $username, $password, $dbname) {
   global $db_link;
   
   if (phpversion() < "7.0.0") {
      if ($result = mysql_connect($hostname, $username, $password)) {
         mysql_selectdb($dbname);
      }
      return $result;
   }
   
   $db_link = mysqli_connect($hostname, $username, $password, $dbname);
   return $db_link;
}

function db_query($query) {
   global $db_link;
   if (phpversion() < "7.0.0") {
      return mysql_query($query);
   }
   return mysqli_query($db_link, $query);
}

function db_error() {
   global $db_link;
   if (phpversion() < "7.0.0") {
      return mysql_error();
   }
   return mysqli_error($db_link);
}

function db_fetch_array($result) {
   if (phpversion() < "7.0.0") {
      return mysql_fetch_array($result, MYSQL_ASSOC);
   }
   return mysqli_fetch_array($result, MYSQLI_ASSOC);
}

function db_num_rows($result) {
   if (phpversion() < "7.0.0") {
      return mysql_num_rows($result);
   }
   return mysqli_num_rows($result);
}

/* Always init database when this module is loaded */
db_init();

?>
