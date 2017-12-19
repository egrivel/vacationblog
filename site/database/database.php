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
      if (!db_connect($hostname, $username, $password, $dbname)) {
        echo "Could not connect: " . db_error() . '<br/>\n';
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
  if (isset($_ENV['DB_VERSION'])) {
    return $_ENV['DB_VERSION'];
  }
  return '';
}
function db_get_create_default() {
  $version = db_get_installed_version();
  if ($version === 'mysql-5.7') {
    return 'CURRENT_TIMESTAMP(6)';
  } else {
    return '\'0000-00-00 00:00:00\'';
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

function db_connect($hostname, $username, $password, $dbname) {
   if (phpversion() < "7.0.0") {
      if ($result = mysql_connect($hostname, $username, $password)) {
         mysql_selectdb($dbname);
      }
      return $result;
   }
   return mysqli_connect($hostname, $username, $password, $dbname);
}

function db_query($query) {
   if (phpversion() < "7.0.0") {
      return mysql_query($query);
   }
   return mysqli_query($query);
}

function db_error() {
   if (phpversion() < "7.0.0") {
      return mysql_error();
   }
   return mysqli_error();
}

function db_fetch_array($result) {
   if (phpversion() < "7.0.0") {
      return mysql_fetch_array($result, MYSQL_ASSOC);
   }
   return mysqli_fetch_array($result, MYSQL_ASSOC);
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
