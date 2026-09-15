<?php
ini_set("display_errors", 0); error_reporting(~E_ALL);
#ini_set("display_errors", 1); error_reporting(E_ALL);

#require_once "games/lobby/server_logs/database.inc.php";
require_once "database.inc.php";
#require_once $_SERVER["DOCUMENT_ROOT"]. "/common/services/transactions.inc.php";
require_once $_SERVER['DOCUMENT_ROOT']. '/common/services/transactions.inc.php';
$db = Database::getObject("core");

$provider= "progaindia";
$session_id = ""; # todo try with any artibraty session_id for FUN mode
$money_modes = Array("REAL" => Array("type" =>"real", 'amount_type_id' => 1), 
                    "DEMO" => Array("type" => "fun", 'amount_type_id' => 4))[$_GET["for_demo"]];

$channels = Array("web" => "desktop", "mobile" => "mobile");
$game_id = $_GET['game_code'];
$api_key = Array("JPSG" => "xmT0ksQTTzBtQtNt");


if (array_key_exists($_GET["operator_id"], $api_key)){
    $api_key = $api_key[$_GET["operator_id"]];
} else {
    print "Config is not available for the given Partnet Id";
    exit;
}

function validate_game_id(){
    global $db, $api_key, $money_modes, $game_id;

    $query_site_config =<<<DB
            SELECT app_key, site_id, operator_id
            FROM services.site_configurations
            WHERE app_key = '{$api_key}'
DB;
    $result = $db->runQuery($query_site_config);
    $site_details = $db->fetchAssoc($result);

    $query_games =<<<DB
        SELECT gms.game_name AS game_name,
        gms.category AS category,
        gms.game_id AS game_id
 FROM   gamelobby.games AS gms,
        gamelobby.game_status AS gst
 WHERE  gms.game_id = '{$game_id}'
        AND gms.channel = 'desktop'
        AND gst.site_id = {$site_details["site_id"]}
        AND gms.row_id = gst.row_id
        AND gst.amount_type_id = {$money_modes['amount_type_id']}
        AND gst.status = 1
DB;


    $result = $db->runQuery($query_games);
    if($db->numRows($result) > 0) {
        return $db->fetchAssoc($result);
    }else{
        print "Error ->  Invalid game Id Or game is not enabled";
        exit;
    }
}

function get_fun_mode_session_id()
{
    $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return substr(str_shuffle($permitted_chars), 0, 32);
}

if($money_modes['type'] == 'fun') {
    $session_id = get_fun_mode_session_id();
    initiate_game_launch();
}
else if(isset($_GET['token'])) {
    $session_id = $_GET['token'];
    initiate_game_launch();
}

function initiate_game_launch($load_game=1)
{
    $game_details = validate_game_id();
    global $api_key, $session_id, $provider, $money_modes;

    $amount_type = $money_modes['type'];
    $language = $_GET['language'];
    $channel = 'desktop';
    $game_id = $game_details["game_id"];
    $deposit_url = null;
    $lobby_url = null;
    $player_ip = $_GET['ip'];
    $context= array(
        "id" => $_GET['player_id'],    # Just arbitrary player_id. API disregards this. Commented by lalith
        "username" => $_GET['player_id'], # Just arbitrary username. API disregards this.
        "country" => $_GET['country'],
        "currency" => $_GET['currency'],
        "client_id" => $_GET['operator_id']
    );

    $res = Transaction::callGameLauncher($api_key, $session_id, $provider, $game_details['category'],
        $game_id, $channel, $language, $amount_type, $context, $deposit_url, $lobby_url);

    if($load_game === 0) {
        return;
    }

    if(isset($res['launch_url'])) {
            header("Location: {$res['launch_url']}");
    } else {
        print "Error in receving the launch URL";
    }
}
?>
