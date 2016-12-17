<?php
include_once(dirname(__FILE__) . "/database.php");
// Include the compatibility pibrary with PHP 5.5's simplified password
// hashing API
include_once(dirname(__FILE__) . "/../lib/password/password.php");

define('LEVEL_VISITOR', 'visitor');
define('LEVEL_CONTRIB', 'contrib');
define('LEVEL_ADMIN', 'admin');
define('LEVEL_SYNCH', 'synch');

class User {

   private $userId;
   private $password;
   private $created;
   private $updated;
   private $latestUpdated;
   private $name;
   private $externalType;
   private $externalId;
   private $access;
   private $email;
   private $notification;
   private $tempCode;
   private $deleted;
   private $latestDeleted;
   private $hash;

   /* ============================================================ */
   /* Private functions                                            */
   /* ============================================================ */

   /**
    * Erase the contents of this object (wipe all fields).
    */
   private function eraseObject() {
      $this->userId = "";
      $this->password = "";
      $this->created = null;
      $this->updated = null;
      $this->latestUpdated = null;
      $this->name = "";
      $this->externalType = "";
      $this->externalId = "";
      $this->access = "";
      $this->email = "";
      $this->notification = "";
      $this->tempCode = "";
      $this->deleted = "N";
      $this->hash = "";
      $this->latestHash = "";
   }

   private static function createUserTable() {
      $createDefault = db_get_create_default();
      $updateDefault = db_get_update_default();
      $query = "CREATE TABLE IF NOT EXISTS blogUser("
         . "userId CHAR(32) NOT NULL, "
         // Use 255 characters for the password, even though the inital version
         // only uses 60 characters. See the PHP password_hash() manual page
         // for details.
         . "password VARCHAR(255), "
         // Note 1: there can be only a single TIMESTAMP field that defaults
         // to CURRENT_TIMESTAMP, which should logically be the "updated"
         // field, since that should always be the "now()" when inserting a
         // row. However, by defining the "created" field with a default value
         // of zero time, and pasing null in when creating the first row,
         // it automatically gets set to the current time as well. Obviously,
         // when creating subsequent rows, the originally created timestamp
         // has to be passed in anyway.
         // Note 2: use TIMESTAMP(6) rather than TIMESTAMP to get a
         // microsecond-precision for the timestamp. This will allow the
         // distinction of multiple inserts within the same second (unlikely,
         // but can happen, especially in testing).
         . "created TIMESTAMP(6) DEFAULT $createDefault, "
         . "updated TIMESTAMP(6) DEFAULT $updateDefault, "
         . "name TEXT, "
         . "externalType CHAR(16), "
         . "externalId TEXT, "
         . "access CHAR(16), "
         . "email CHAR(64), "
         . "notification CHAR(1), "
         . "tempCode CHAR(32), "
         . "deleted CHAR(1), "
         . "hash CHAR(32), "
         . "PRIMARY KEY(userId, updated), "
         . "KEY(email)"
         . ")";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addDeletedColumn() {
      $query = "ALTER TABLE blogUser "
         . "ADD COLUMN deleted CHAR(1)";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addNotificationColumn() {
      $query = "ALTER TABLE blogUser "
         . "ADD COLUMN notification CHAR(1)";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   /* ============================================================ */
   /* Constructor / destructor                                     */
   /* ============================================================ */

   /**
    * Constructor. This will load the information for the specified user
    * if a user ID is given and that user ID exists.
    * If no user ID is passed, an empty user object is constructed.
    * If a user ID is passed but no user with that ID exists, the user object
    * will have the user ID set but all other fields will be empty.
    */
   function __construct($userId = "") {
      if (!isset($userId) || ($userId === "")) {
         throw new InvalidArgumentException("Need to provide user ID");
      }
      $this->load($userId);
   }

   /* ============================================================ */
   /* Public functions                                             */
   /* ============================================================ */

   /**
    * Update the database structure if needed. This function includes all
    * the incremental steps needed to bring the database up to the latest
    * standard.
    * Basically, this function is a big switch on the data version value
    * with each case falling through to the next one.
    */
   public static function updateTables($dataVersion) {
      switch ($dataVersion) {
      case "":
         // No data version yet - create initial table
         User::createUserTable();
         break;
      case "v0.1":
      case "v0.2":
      case "v0.3":
      case "v0.4":
      case "v0.5":
      case "v0.6":
      case "v0.7":
      case "v0.8":
      case "v0.9":
      case "v0.10":
          if (!User::addDeletedColumn()) {
             return false;
          }
      case "v0.11":
      case "v0.12":
      case "v0.13":
         if (!User::addNotificationColumn()) {
            return false;
         }
      case "v0.14":
      case "v0.15":
      case "v0.16":
      case "v0.17":
         // current version
         break;
      default:
         // no provision for this version, should not happen
         print "User::updateTables($dataVersion): don't know this version.\n";
         return false;
      }
      return true;
   }

   /**
    * Load the object from the result of a MySQL query.
    */
   protected function loadFromResult($result) {
      $line = mysql_fetch_array($result, MYSQL_ASSOC);
      $this->userId = db_sql_decode($line['userId']);
      $this->password = db_sql_decode($line['password']);
      $this->created = db_sql_decode($line['utc_created']);
      if (!isset($this->created) || ($this->created === "")) {
         // For timestamp, default is null rather than empty string
         $this->created = null;
      }
      $this->latestUpdated = db_sql_decode($line["utc_updated"]);
      if (!isset($this->latestUpdated) || ($this->latestUpdated === "")) {
         // For timestamp, default is null rather than empty string
         $this->latestUpdated = null;
      }
      $this->updated = null;
      $this->name = db_sql_decode($line["name"]);
      $this->externalType = db_sql_decode($line["externalType"]);
      $this->externalId = db_sql_decode($line["externalId"]);
      $this->access = db_sql_decode($line["access"]);
      $this->email = db_sql_decode($line["email"]);
      $this->notification = db_sql_decode($line["notification"]);
      $this->tempCode = db_sql_decode($line["tempCode"]);
      $this->deleted = db_sql_decode($line["deleted"]);
      $this->hash = db_sql_decode($line["hash"]);
      $this->latestHash = $this->hash;
      return true;
   }

   /**
    * Load the requested user into the current user object. If the user ID
    * exists, the (latest) information in the database for that user ID will
    * be loaded. If the user ID does not exist, all fields except for the
    * user ID field will be blanked.
    * @param $userId the user ID to load. This must be a valid non-empty
    * user ID.
    * @return true when data is successfully loaded, false if no user data
    * is loaded (object will be empty except for userID).
    */
   public function load($userId = "") {
      $this->eraseObject();
      if (!isset($userId) || ($userId === "")) {
         return false;
      }
      $this->userId = $userId;

      $userIdValue = db_sql_encode($userId);
      $query = "SELECT *, "
         . "CONVERT_TZ(`created`, @@session.time_zone, '+00:00') "
         .   "AS `utc_created`, "
         . "CONVERT_TZ(`updated`, @@session.time_zone, '+00:00') "
         .   "AS `utc_updated` "
         . "FROM blogUser "
         . "WHERE userId=$userIdValue "
         . "ORDER BY updated DESC "
         . "LIMIT 1";
      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return false;
      }
      if (mysql_num_rows($result) <= 0) {
         // User does not exist
         return false;
      }

      return $this->loadFromResult($result);
   }

   /**
    * Load the user by email address. This will load the information about
    * the user identified by the email address, if the email address is
    * current for any user. Returns true on success, false if the email
    * address is not the current address for any user.
    * If there are multiple users that have this email address, the most
    * recently updated user with this email address is returned.
    */
   public function loadByEmail($email) {
      $this->eraseObject();
      if (!isset($email) || ($email === "")) {
         return false;
      }
      $emailValue = db_sql_encode($email);

      $query = ""
         . "SELECT blogUser.userId, blogUser.email, blogUser.updated "
         .   "FROM blogUser "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.userId as userId "
         .     "FROM blogUser "
         .     "AS t1 "
         .     "GROUP BY t1.userId"
         .   ") "
         .   "AS t2 "
         .   "WHERE blogUser.userId=t2.userId "
         .     "AND blogUser.updated=t2.updated "
         .     "AND blogUser.email=$emailValue "
         .   "ORDER BY blogUser.updated DESC "
         .   "LIMIT 1";
      // print "\n$query\n";
      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return false;
      }
      if (mysql_num_rows($result) <= 0) {
         // User does not exist
         return false;
      }

      $line = mysql_fetch_array($result, MYSQL_ASSOC);
      $userId = db_sql_decode($line["userId"]);
      return $this->load($userId);
   }

   public function save() {
      if (!isset($this->userId) || ($this->userId === "")) {
         // Need a user ID before we can save. Any user ID is fine.
         return false;
      }

      $query = "INSERT INTO blogUser SET "
         . "userId=" . db_sql_encode($this->userId)
         . ", password=" . db_sql_encode($this->password)
         . db_created($this->created)
         . db_updated($this->updated)
         . ", name=" . db_sql_encode($this->name)
         . ", externalType=" . db_sql_encode($this->externalType)
         . ", externalId=" . db_sql_encode($this->externalId)
         . ", access=" . db_sql_encode($this->access)
         . ", email=" . db_sql_encode($this->email)
         . ", notification=" . db_sql_encode($this->notification)
         . ", tempCode=" . db_sql_encode($this->tempCode)
         . ", deleted=" . db_sql_encode($this->deleted)
         . ", hash=" . db_sql_encode($this->hash);
      // print "Saving to database: $query<br/>\n";
      if (mysql_query($query)) {
         // Saved successfully, now load fresh, including created and
         // updated values, and update the hash value
         $mustUpdateHash = true;
         if ($this->hash !== $this->latestHash) {
            // Hash value was manually set, so don't re-calculate it
            $mustUpdateHash = false;
         }

         if ($this->load($this->userId)) {
            if ($mustUpdateHash) {
               $value = "|"
                  . $this->password . "|"
                  . $this->created . "|"
                  . $this->latestUpdated . "|"
                  . $this->name . "|"
                  . $this->externalType . "|"
                  . $this->externalId . "|"
                  . $this->access . "|"
                  . $this->email . "|"
                  . $this->notification . "|"
                  . $this->tempCode . "|"
                  . $this->deleted . "|";
               $this->hash = md5($value);
               $this->latestHash = $this->hash;
               $query = "UPDATE blogUser SET "
                  . "hash=" . db_sql_encode($this->hash)
                  . " WHERE userId=" . db_sql_encode($this->userId)
                  .   " AND updated="
                  . "CONVERT_TZ(" . db_sql_encode($this->latestUpdated)
                  . ",'+00:00','SYSTEM')";
               if (mysql_query($query)) {
                  return true;
               } else {
                  print $query . "<br/>";
                  print " --> error: " . mysql_error() . "<br/>\n";
                  return false;
               }
            }
            return true;
         } else {
            return false;
         }
      } else {
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return false;
      }
   }

   /* Check the password to see if it matches.
    *
    * Note: if this function returns success, it should be followed by a
    * call to updatePasswordHash() to allow the system to update the
    * password hash value in the database using a newer (better) algorithm.
    */
   public function checkPassword($value) {
      if ($value === null) {
         // not a valid password to check
         return false;
      } else if ($value === "") {
         // empty password must be represented by empty hash
         return $this->password === "";
      } else if ($this->password === "") {
         // if hash is empty, it doesn't match a non-empty password
         return false;
      } else {
         if (substr($this->password, 0, 3) === '$0$') {
            // passwords loaded from old system
            return (substr($this->password, 3) === md5($value));
         } else {
            return password_verify($value, $this->password);
         }
      }
   }

   /*
    * Check if the password hash needs to be updated using a newer algorithm.
    * If the password hash needs to be updated, the updated hash is computed
    * and stored in the database. This causes a new row to be inserted.
    */
   public function updatePasswordHash($value) {
      if (($value !== null) && ($value !== "") && ($this->password !== "")) {
         if (substr($this->password, 0, 3) === '$0$') {
            // passwords loaded from old system, always must be updated
            $this->password = password_hash($value, PASSWORD_DEFAULT);
            // Note: need to save to database and re-load to get the new
            // 'updated' and 'hash' fields
            $this->save();
            return true;
         } else {
            if (password_needs_rehash($this->password, PASSWORD_DEFAULT)) {
               $this->password = password_hash($value, PASSWORD_DEFAULT);
               // Note: need to save to database and re-load to get the new
               // 'updated' and 'hash' fields
               $this->save();
               return true;
            }
         }
      }
      return false;
   }

   public function setPassword($value) {
      // $this->password = md5(value);
      $this->password = password_hash($value, PASSWORD_DEFAULT);
   }

   public function getUserId() {
      return $this->userId;
   }

   // for use in synchronization only
   public function getPasswordHash() {
      return $this->password;
   }

   // for use in synchronization only
   public function setPasswordHash($value) {
      $this->password = $value;
   }

   public function getCreated() {
      return $this->created;
   }

   public function setCreated($value) {
      $this->created = $value;
   }

   public function getUpdated() {
      return $this->updated ? $this->updated : $this->latestUpdated;
   }

   public function setUpdated($value) {
      $this->updated = $value;
   }

   public function getName() {
      return $this->name;
   }

   public function setName($value) {
      $this->name = $value;
   }

   public function getExternalType() {
      return $this->externalType;
   }

   public function setExternalType($value) {
      $this->externalType = $value;
   }

   public function getExternalId() {
      return $this->externalId;
   }

   public function setExternalId($value) {
      $this->externalId = $value;
   }

   public function getAccess() {
      return $this->access;
   }

   public function setAccess($value) {
      $this->access = $value;
   }

   public function getEmail() {
      return $this->email;
   }

   public function setEmail($value) {
      $this->email = $value;
   }

   public function getNotification() {
      return $this->notification;
   }

   public function setNotification($value) {
      $this->notification = $value;
   }

   public function getTempCode() {
      return $this->tempCode;
   }

   public function setTempCode($value) {
      $this->tempCode = $value;
   }

   public function getDeleted() {
      return $this->deleted;
   }

   public function setDeleted($value) {
      $this->deleted = $value;
   }

   public function getHash() {
      return $this->hash;
   }

   public function setHash($value) {
      $this->hash = $value;
   }

   /**
    * Create an instance by the hash value. This function is in support
    * of the synchronization functionality. It takes a hash value and
    * it will return an instance of the object for that hash value
    * if the hash exists. If the hash does not exist, null will be
    * returned, indicating that the object should be created using the
    * normal constructor.
    */
   static public function findByHash($hash = '') {
      if (!isset($hash) || ($hash === '')) {
         return null;
      }
      $hashValue = db_sql_encode($hash);
      $query = "SELECT *, "
         . "CONVERT_TZ(`created`, @@session.time_zone, '+00:00') "
         .   "AS `utc_created`, "
         . "CONVERT_TZ(`updated`, @@session.time_zone, '+00:00') "
         .   "AS `utc_updated` "
         . "FROM blogUser "
         . "WHERE hash=$hashValue "
         . "ORDER BY updated DESC "
         . "LIMIT 1";
      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return null;
      }
      if (mysql_num_rows($result) <= 0) {
         // Object does not exist
         return null;
      }

      // Create an instance with a special ID '-' to bypass the
      // checks on empty ID. The ID value will be overwritten by the
      // value coming back from the database anyway.
      $object = new User('-');
      if ($object->loadFromResult($result)) {
         return $object;
      }
      return null;
   }

   static function listUsers() {
      $query = ""
         . "SELECT blogUser.userId, blogUser.name, "
         .   "blogUser.updated "
         .   "FROM blogUser "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.userId as userId "
         .     "FROM blogUser "
         .     "AS t1 "
         .     "GROUP BY t1.userId"
         .   ") AS t2 "
         .   "WHERE blogUser.userId = t2.userId "
         .     "AND blogUser.updated = t2.updated "
         .     "AND blogUser.deleted != 'Y' "
         .   "ORDER BY blogUser.name ";

      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return false;
      }

      $list = array();
      if (mysql_num_rows($result) > 0) {
         $count = 0;
         while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
            $userId = db_sql_decode($line["userId"]);
            $name = db_sql_decode($line['name']);
            $list[$count++] =
               array('userId'=>$userId, 'name'=>$name);
         }
      }

      return $list;
   }

   static function findByEmail($email) {
      if (!isset($email) || ($email === '')) {
         return null;
      }
      $emailValue = db_sql_encode($email);

      // Need to get an active user with the given email
      $query = ""
         . "SELECT *, "
         . "CONVERT_TZ(`created`, @@session.time_zone, '+00:00') "
         .   "AS `utc_created`, "
         . "CONVERT_TZ(blogUser.updated, @@session.time_zone, '+00:00') "
         .   "AS `utc_updated` "
         .   "FROM blogUser "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.userId as userId "
         .     "FROM blogUser "
         .     "AS t1 "
         .     "GROUP BY t1.userId"
         .   ") AS t2 "
         .   "WHERE blogUser.userId = t2.userId "
         .     "AND blogUser.updated = t2.updated "
         .     "AND blogUser.deleted != 'Y' "
         .     "AND blogUser.email = $emailValue "
         .   "LIMIT 1 ";
      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return null;
      }
      if (mysql_num_rows($result) <= 0) {
         // Object does not exist
         return null;
      }

      // Create an instance with a special ID '-' to bypass the
      // checks on empty ID. The ID value will be overwritten by the
      // value coming back from the database anyway.
      $object = new User('-');
      if ($object->loadFromResult($result)) {
         return $object;
      }
      return null;
   }
}
?>
