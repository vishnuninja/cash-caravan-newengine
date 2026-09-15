<?php
/**
 * @file  database.inc.php
 * @class Database
 * @desc  This class is an abstraction of MySQL database connection.
 *
 * @author Raman
 * @date   03 May 2018
 */

$db_config =  Array('core' => Array ('host' => 'localhost',
                                     'username' => 'root',
                                     'password' => ''));

class Database {
    var $conn;

   /**
     * @function __construct
     * @param $config Array contains DB host, username and passwd
     *
     * @note Use static methond Database::GetObject for creating database connection instead of
     *       creating using the instance/constructor
     *
     */
	private function __construct($config) {
		$this->conn = null;
        $this->conn = mysqli_connect($config['host'],
                                     $config['username'],
                                     $config['password']);
        if(!$this->conn)
            print mysql_error();
    }

	public function __destruct() {
        if($this->conn) {
		    mysqli_close($this->conn);
		    $this->conn = null;
        }
    }

	public function close() {
		if($this->conn) {
			mysqli_close($this->conn);
			$this->conn = null;
        }
    }

	/**
     * @return Returns database connection object
     */

	public static function getObject($name='core') {
        return Database::GetDBObject($name);
    }

    public static function GetDBObject($name) {
        static $ConnectionCache = array();
        $db_config = Database::getDbConfig($name);

        $db_conn_key = $db_config['host'] . $db_config['username'];
        if(isset($ConnectionCache[$db_conn_key])) {
			return $ConnectionCache[$db_conn_key];
		}
        else {
			$ConnectionCache[$db_conn_key] = new Database($db_config);
		}
        return $ConnectionCache[$db_conn_key];
    }

    public static function getDbConfig($name) {
        global $db_config;

        if(!array_key_exists($name, $db_config)) {
            print "DB config not found";
            exit;
        }

        return $db_config[$name];
    }

	// Executing the given query
    public function runQuery($sql) {
        $rs = mysqli_query($this->conn, $sql) or die($this->error());

        return $rs;
    }

	/**
	 * @desc This function takes care of fetching result set of MySQL
     * @param $result Result returned by database query
     *
	 * @return Returns an enumarable array
	 *
     */
    public function fetchRow($resultset) {
		return mysqli_fetch_row($resultset);
	}

    public function fetchArray($result, $result_type = MYSQL_ASSOC) {
        return mysqli_fetch_array($result, $result_type);
    }

    /**
     * @desc Provides DB query result in the form of associative array
     */
    public function fetchAssoc($result) {
		return mysqli_fetch_assoc($result);
	}

	public function numRows($resultset) {
		return mysqli_num_rows($resultset);
	}

    public function affectedRows() {
		return mysqli_affected_rows($this->conn);
	}

    public function error() {
		return mysqli_error($this->conn);
	}

    public function errorNumber() {
		return mysqli_errno($this->conn);
	}
}
?>
