<?php
// header('Content-Type: application/json');
// header('Access-Control-Allow-Origin: *');
// ini_set("display_errors", 0); error_reporting(~E_ALL);
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
require_once 'database.inc.php';

$db = Database::getObject('core');

if(count($_REQUEST) != 2) {
    $retVal = false;
}
elseif(!isset($_REQUEST['useName'])) {
	$retVal = false;
}
elseif(!isset($_REQUEST['passWD'])) {
	$retVal = false;
}
else {

	global $db;

	$uName = $_REQUEST['useName'];
	$passWd = $_REQUEST['passWD'];

    $query = <<<QRY
        SELECT *
          FROM users.account
         WHERE username = '{$uName}' AND
               password = '{$passWd}'
         LIMIT 1
QRY;

	$result = $db->runQuery($query);
    // print_r( $result);
	$retVal = ($db->numRows($result) == 1) ? true : 3;

}

// header('<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">');
// header('Content-Type: application/json');
// header('Access-Control-Allow-Origin: *');

print json_encode(array('status' => $retVal));
exit();
?>
