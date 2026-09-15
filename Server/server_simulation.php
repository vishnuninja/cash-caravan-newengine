 <?php 
// ini_set("display_errors", 0);
// // ini_set("display_errors", 1); error_reporting(E_ALL);
// header('Content-Type: application/json');
// date_default_timezone_set('Asia/Kolkata');
// header('Access-Control-Allow-Origin: *');
// define("ENGINE_MODE_SIMULATION", True);
// ini_set('max_execution_time', 0);

require_once __DIR__ . '/server.php';
for ($i=0; $i < 1; $i++) { 
    # code...
     $request_params = array();
    $request_params['game_id'] = 717;
    $request_params['amount_type'] = 1;
    $request_params['request_type'] = 2; // normal ante
    $request_params['sub_game_id'] = 1; // normal 
    // $request_params['request_type'] = 8; //buy fg 
    // $request_params['sub_game_id'] = 3; // buy fg
    // $request_params['sub_game_id'] = 5;  // nate 
    // $request_params['coin_value'] = 20; // ante
    $request_params['coin_value'] = 20; // norma, buy fg
     $request_params['num_coins'] = 1;
    $request_params['num_betlines'] = 1;
    $request_params['account_id'] = 49;
    $request_params['username'] = "pg9";
    $request_params['session_id'] = "";
    $request_params['platform_type'] = "desktop";
     $res = main($request_params);
    //  print_r($res);
}

?>

