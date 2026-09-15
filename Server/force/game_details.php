<?php
#ini_set("display_errors", 1);
#error_reporting(E_ALL);

require_once 'database.inc.php';


define("FORCING_TABLE", "gamelog.forcing_data");
define("GAME_CONFIG_TABLE", "game.slots");

# global Database object for communication with MySQL
$db = Database::getObject('core');

/*!
 * @desc Following are the allowed requests from force tool client
 */
if(isset($_POST['request_type'])) {
    $request_type = $_POST['request_type'];

    if($request_type == 'games_list') {
        $games_list = get_games_list();
        $games_list = Array("games_list" => $games_list);
        $games_list_json = json_encode($games_list);

        print $games_list_json;
    }
    else if($request_type == 'get_game_reels') {
        $config_id = $_POST['config_id'];
        $game_reels = get_game_reels($config_id);

        print $game_reels;
    }
    else if($request_type == 'force_outcome') {
        return force_outcome($_POST);
    }
    else if($request_type == 'unforce_outcome') {
        return unforce_outcome($_POST);
    }
    else {
        print "Invalid Request";
    }
}

/*!
 * @desc Function retunrs list of games to show in
 *       drop down list.
 */
function get_games_list()
{
    global $db;
    $game_config = GAME_CONFIG_TABLE;

    $query = <<<QUERY
        SELECT sub_game_id, game_name, description as title
          FROM {$game_config}
         ORDER BY game_name, sub_game_id
QUERY;

    $games_list_str = "<center><select id='games_list_options'
        onchange='return display_game_reels()'><option>Select Game</option>";
    $result = $db->runQuery($query) or die("Error in DB.");

    while($row = $db->fetchAssoc($result))
    {
        $sub_game_id = $row['sub_game_id'];
        $title = $row['title'];
        $game_name = $row['game_name'];
        $game_identifier = $game_name . ":" . (string) $sub_game_id;

        $games_list_str .= "<option value='{$game_identifier}'>{$title}</option>";
    }

    return $games_list_str . "</select></center>";
}

/*!
 * @desc Function retunrs the reels of the game+config_id selected
 */
function get_game_reels($config_id)
{
    global $db;
    $game_config = GAME_CONFIG_TABLE;

    $tokens = explode(":", $config_id);
    $game_name = $tokens[0];
    $sub_game_id = $tokens[1];

    $query = <<<QUERY
        SELECT game_name, num_columns, reels, sub_game_id, num_rows, title
          FROM {$game_config}
         where game_name = '{$game_name}' AND sub_game_id = {$sub_game_id}
QUERY;

    $result = $db->runQuery($query) or die($db->error());
    $row = $db->fetchAssoc($result);
    $reels= $row['reels'];
    $config_id = $row['sub_game_id'];
    $game_name =$row['game_name'];
    $display_name = $row['title'];
    $num_rows = $row['num_rows'];
    $num_reels = $row['num_columns'];
    $expiry_time = time() + (60 * 60 * 5); # 5 hours

    setcookie('config_id', $config_id, $expiry_time, "/");      # todo rename cookie name
    setcookie('game_name', $game_name, $expiry_time, "/");
    setcookie('display_name', $display_name, $expiry_time, "/");# todo rename cookie name
    setcookie('num_rows', $num_rows, $expiry_time, "/");        # todo rename cookie name
    setcookie('num_reels', $num_reels, $expiry_time, "/");      # todo rename cookie name

    $image_path = 'assets/symbol_images/default/';
    $symbol_extension = ".png";

    if(is_dir("assets/symbol_images/{$game_name}")) {
        $image_path = "assets/symbol_images/{$game_name}/";
        $symbol_extension = ".jpg";
    }

    $reels_array = json_decode($reels);
    $reels_ui = "";
    foreach($reels_array as $index => $reel)
    {
      $reel_length = strlen($reel);
      setcookie("length_of_reel_".$index, $reel_length, $expiry_time, "/"); # todo rename cookie name
      $symbol_str = "";
      $reel_ui = "";
      for($i = 0; $i < $reel_length; $i++)
      {
        $symbol = strtolower(substr($reel, $i, 1));
        $symbol_number = $i + 1;
        $reel_ui .= "<div><div class='symbol_number'>{$symbol_number}</div><div class='symbol'> <a id='{$index}_reel_{$i}'
            onclick='return set_outcome(this.id);' > <img src='{$image_path}{$symbol}{$symbol_extension}'
            id='{$index}_image_{$i}' class='reel_symbol'/></a></div></div>";
      }

      $reels_ui .= "<div class='reel_display'> {$reel_ui} </div>";
    }

    $reels_outcome_str = ""; $positions_str ="";
    for($i = 0; $i < $num_reels; $i++) {
        $div_id_num = $i + 1;
        $reels_outcome_str .="<div id='forced_outcome_{$div_id_num}' class='forced_outcome' ></div>";
        $positions_str .="<div id='forced_position_{$div_id_num}' class='forced_position'></div>";
    }

    $outcome = Array("game_reels" => $reels_ui,
                     "default_outcome" => $reels_outcome_str,
                     "default_positions" => $positions_str);

    return json_encode($outcome);
}

function force_outcome($params)
{
    global $db;
    $forcing_table = FORCING_TABLE;

    if(!isset($params['forced_positions']) or !isset($params['config_id']) or
       !isset($params['game_name']) or !isset($params['account_id']) or
       !$params['forced_positions'] or !$params['config_id'] or !$params['game_name'] or !$params['account_id'] or
       $params['forced_positions'] == null or $params['config_id'] == null or $params['game_name'] == null or $params['account_id'] == null) {
        print "Invalid data received";
        return;
    }

    $forcing_query = <<<QUERY
        REPLACE INTO {$forcing_table}(account_id, game_id, game_name,
                     reel_positions, timestamp, expiry_date)
         VALUES ({$params['account_id']}, {$params['config_id']},
                 '{$params['game_name']}', '{$params['forced_positions']}',
                 now(), DATE_ADD(now(), INTERVAL 1 hour))
QUERY;

    $result = $db->runQuery($forcing_query) or print $db->error();
    if($result) {
        print "Forcing is successful";
    }
    else {
        print "Forcing is not successful due to error: " . $db->error();
    }
}

function unforce_outcome($params)
{
    global $db;
    $forcing_table = FORCING_TABLE;

    if(!isset($params['game_name']) or !isset($params['account_id']) or
       !$params['game_name'] or !$params['account_id'] or
       $params['game_name'] == null or $params['account_id'] == null) {
        print "Invalid data received";
        return;
    }

    $forcing_query = <<<QUERY
        DELETE FROM {$forcing_table}
         WHERE account_id = {$params['account_id']} AND
               game_name = '{$params['game_name']}'
QUERY;

    $result = $db->runQuery($forcing_query) or print $db->error();
    if($result) {
        print "Unforcing is successful";
    }
    else {
        print "Unforcing is not successful due to error: " . $db->error();
    }
}
?>
