<?php
session_start();

header('<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_destroy();
print json_encode(array('status' => true));
exit();
?>
