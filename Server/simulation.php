<?php
ini_set("display_errors", 1); #error_reporting(E_ALL);
// ini_set("display_errors", 0); error_reporting(~E_ALL);
define("ENGINE_MODE_SIMULATION", True);
ini_set('max_execution_time', 0);
#============== Configuration starts here ================
$initial_cycle = $cycle = 1000;
// $coin_values = array(1,2,3,5,10,20,50,100,200,400);
// $index = array_rand($coin_values);
// $coin_values[$index];
$coin_value_sim = 1;
$username_sim = 'pg1';
$account_id = 42;
$round_id_sim = 1;
$num_coins_sim = 30;
$num_betlines_sim = 30;
$game_id = 708;
#$usernames_sim = Array('ng0', 'ng1', 'ng2', 'ng3', 'ng4', 'ng5');
#=========================================================
$request_params_sim = array();
$request_params_sim['game_id'] = $game_id;
$request_params_sim['request_type'] = 2;
$request_params_sim['amount_type'] = 1;
$request_params_sim['coin_value'] = $coin_value_sim;
$request_params_sim['num_coins'] = $num_coins_sim;
$request_params_sim['num_betlines'] = $num_betlines_sim;
$request_params_sim['username'] = $username_sim;
$request_params_sim['session_id'] = "";
$request_params_sim['platform_type'] = "desktop";
$request_params_sim['sub_game_id'] = "1";
#====================================================
$_POST = $request_params_sim;
$request_params = $request_params_sim;
// print_r($request_params);
#=====================================
$game_name = "terracottawarrior";
$date_time = date("dmY_hisa");
$log_file_name = $game_name.'_'."summary".'_'.$date_time.'.txt';
$log_file = fopen($log_file_name, 'a');

$bet_distribution = array("normal"=>0);
$win_distribution = array("normal"=>0);
$win_amount = 0;
$bet_amount = 0;
#=====================================
$server_response = array();

$total_bet_simulation = 0;
$totalNormalWin = 0;
$totalScatterWin = 0;
$totalFreeGameWin = 0;
$totalBonusWin = 0;
$total_win_simulation = 0;
$totalBonusWin2 = 0;
#==========================
$maxWin = array("normal" => 0);

$rtps = Array(
	'normal' => Array(
		'hit_freq' => 0,
		'win_amount' => 0,
		'total_normal_spins' => $cycle),
	);
	// $fs_details = Array(
	// 	"freespins_frequency" => 0,
	// 	"total_freespins" => 0,
	// 	"respins_frequency" => 0,
	// 	"total_respins" => 0,
	// 	"max_fs_win_amount" => 0
	// );
	
$start_date_time = date("M,d,Y h:i:s A");
$start_time = time();
//////////// CSV file ////////////////////////
$round_bet_amount = 0; $round_win_amount = 0; $round_data = array();
$csv_file_obj = open_csv_file($game_name);
//////////////////////////////////////////
$rtp_set = Array('a' => 0, 90 => 0, 91 => 0, 92 => 0, 93 => 0,
94 => 0, 95 => 0, 96 => 0, 97 => 0, 98 => 0, 99 => 0,
100 => 0, 101 => 0, 102 => 0, 103 => 0, 104 => 0, 105 => 0,
'b' => 0 , 'c' => 0);
$three_scatter = 0;
$nacro_bonus = 0;
$nacro_bonus2 = 0;
$total_scatter = 0;
$bonus_multiplier = 0;
$repeat_num_Normal = array("5w"=>0,"4w"=>0,"3w"=>0,"2w"=>0,"5s"=>0,"4s"=>0,"3s"=>0,"2s"=>0,"5a"=>0,
					"4a"=>0,"3a"=>0,"2a"=>0,"5b"=>0,"4b"=>0,"3b"=>0,"2b"=>0,"5c"=>0,"4c"=>0,"3c"=>0,"2c"=>0,"5d"=>0
					,"4d"=>0,"3d"=>0,"5e"=>0,"4e"=>0,"3e"=>0,"5f"=>0,"4f"=>0,"3f"=>0,"5g"=>0,"4g"=>0,"3g"=>0,"5h"=>0,
					"4h"=>0,"3h"=>0,"5i"=>0,"4i"=>0,"3i"=>0,"5j"=>0,"4j"=>0,"3j"=>0,"5k"=>0,"4k"=>0,"3k"=>0);


$repeat_num_FS = array("5w"=>0,"4w"=>0,"3w"=>0,"2w"=>0,"5s"=>0,"4s"=>0,"3s"=>0,"2s"=>0,"5a"=>0,
					"4a"=>0,"3a"=>0,"2a"=>0,"5b"=>0,"4b"=>0,"3b"=>0,"2b"=>0,"5c"=>0,"4c"=>0,"3c"=>0,"2c"=>0,"5d"=>0
					,"4d"=>0,"3d"=>0,"5e"=>0,"4e"=>0,"3e"=>0,"5f"=>0,"4f"=>0,"3f"=>0,"5g"=>0,"4g"=>0,"3g"=>0,"5h"=>0,
				"4h"=>0,"3h"=>0,"5i"=>0,"4i"=>0,"3i"=>0,"5j"=>0,"4j"=>0,"3j"=>0,"5k"=>0,"4k"=>0,"3k"=>0);

$prev_rtp = 0;
$csv_obj_rtp = get_csv_file($game_name);
$rtp_change_csv_file = get_csv_file($game_name.'_rtp_change');
require_once("server.php");
$counter = 0;
//////////////////////////////////////////////
///////////////////////////////////////////////////////
for($i = 1; $i <= $cycle; $i++) {
// $winRound = 0;
	$counter++;
	$request_params_sim['game_id'] = $game_id;
	$request_params_sim['amount_type'] = 1;
	$request_params_sim['coin_value'] = $coin_value_sim;
	$request_params_sim['num_coins'] = $num_coins_sim;
	$request_params_sim['num_betlines'] = $num_betlines_sim;
	$request_params_sim['username'] = $username_sim;
	$request_params_sim['session_id'] = "";
	$request_params_sim['platform_type'] = "desktop";
	$request_params_sim['request_type'] = 2;
	$request_params_sim['sub_game_id'] = "1";
	$_POST = $request_params_sim;
	$request_params = $request_params_sim;
	$res = main($request_params);

	////////////// CSV file //////////////////////
	$total_bet_simulation += $num_betlines_sim;

	if($server_response["current_round"]["sctter_count"] == 3){
		$total_scatter += $server_response["current_round"]["sctter_count"];
	}

	$winRound = $server_response["current_round"]["win_amount"];

	$totalNormalWin += $server_response["current_round"]["win_amount"];
	$details = $server_response["current_round"]['payline_wins']['details'];
	$str_arr = explode (";", $details);
	// print_r($str_arr);
	for ($k=0; $k < count( $str_arr ); $k++) {
		$win_f = explode (",", $str_arr[$k]);
		// echo $repeat_num_Normal[$win_f[3] .$win_f[5]] ."=".$win_f[3] . $win_f[5];
		if(array_key_exists($win_f[3] . $win_f[5], $repeat_num_Normal)){
			$repeat_num_Normal[$win_f[3] . $win_f[5]] += 1;
		}
	}
	// $total_scatter +=$server_response["current_round"]["sctter_count"] ;
	if($server_response["current_round"]["bonus_games_won"]){

		$resp = decode_object($server_response["current_round"]["bonus_games_won"]);
		if ($resp[0]['bonus_game_id'] == 380001) {
			$request_params_sim['sub_game_id'] = "2";
			$request_params_sim['pick_position'] = "1";
		
			if($counter == 2000 ){
				$request_params_sim['sub_game_id'] = "3";
				$request_params_sim['pick_position'] = "2";
			}
			if($counter == 4000 ){
				$request_params_sim['sub_game_id'] = "4";
				$request_params_simem['pick_position'] = "3";
			}
			if($counter == 6000 ){
				$request_params_sim['sub_game_id'] = "5";
				$request_params_sim['pick_position'] = "4";
			}
			if($counter == 8000 ){
				$request_params_sim['sub_game_id'] = "1";
				$request_params_sim['pick_position'] = "5";
			}
			$three_scatter += 1;
			$resp = decode_object($server_response["current_round"]["bonus_games_won"]);
			$bonus_game_id = $resp[0]['bonus_game_id'];
			$request_params_sim['game_id'] = $game_id;
			$request_params_sim['amount_type'] = 1;
			$request_params_sim['coin_value'] = $coin_value_sim;
			$request_params_sim['num_coins'] = $num_coins_sim;
			$request_params_sim['num_betlines'] = $num_betlines_sim;
			$request_params_sim['username'] = $username_sim;
			$request_params_sim['session_id'] = "";
			$request_params_sim['platform_type'] = "desktop";
			$request_params_sim['request_type'] = 3;
			// $request_params_sim['sub_game_id'] = "2";
			// $request_params_sim['pick_position'] = "1";
			$request_params_sim['bonus_game_id'] = $bonus_game_id;
			$_POST = $request_params_sim;
			$request_params = $request_params_sim;
			$res = main($request_params);
			$num_s = $server_response["current_round"]["num_spins"];
			$fsMul = $server_response["current_round"]["fs_multiplier"];
			if ($fsMul > 1) {
				$totalFreeGameWin += $fsMul;
			} else {
				
				for ($j = 0; $j < $num_s; $j++) {
					$request_params_sim['game_id'] = $game_id;
					$request_params_sim['amount_type'] = 1;
					$request_params_sim['coin_value'] = $coin_value_sim;
					$request_params_sim['num_coins'] = $num_coins_sim;
					$request_params_sim['num_betlines'] = $num_betlines_sim;
					$request_params_sim['username'] = $username_sim;
					$request_params_sim['session_id'] = "";
					$request_params_sim['platform_type'] = "desktop";
					$request_params_sim['request_type'] = 2;
					$request_params_sim['sub_game_id'] = "1";
					$request_params_sim['bonus_game_id'] = $bonus_game_id;
					$_POST = $request_params_sim;
					$request_params = $request_params_sim;
					$res = main($request_params);
					// echo "free spin";

					$totalFreeGameWin += $server_response["current_round"]["win_amount"];
					$details = $server_response["current_round"]['payline_wins']['details'];
					$str_arr = explode(";", $details);
					// print_r($str_arr);
					for ($k = 0; $k < count($str_arr); $k++) {
						$win_f = explode(",", $str_arr[$k]);
						// echo $repeat_num_Normal[$win_f[3] .$win_f[5]] ."=".$win_f[3] . $win_f[5];
						if (array_key_exists($win_f[3] . $win_f[5], $repeat_num_Normal)) {
							$repeat_num_FS[$win_f[3] . $win_f[5]] += 1;
						}
					}
				}
			}
		}
		
		if ($resp[0]['bonus_game_id'] == 380002) {
            $pick_pos = 1;
			$nacro_bonus += 1;
            $bonus_game_id = $resp[0]['bonus_game_id'];
			$request_params_sim['game_id'] = $game_id;
			$request_params_sim['amount_type'] = 1;
			$request_params_sim['coin_value'] = $coin_value_sim;
			$request_params_sim['num_coins'] = $num_coins_sim;
			$request_params_sim['num_betlines'] = $num_betlines_sim;
			$request_params_sim['username'] = $username_sim;
			$request_params_sim['session_id'] = "";
			$request_params_sim['platform_type'] = "desktop";
			$request_params_sim['request_type'] = 6;
			$request_params_sim['sub_game_id'] = "1";
			$request_params_sim['pick_position'] = $pick_pos;
			$request_params_sim['bonus_game_id'] = $bonus_game_id;
			$_POST = $request_params_sim;
			$request_params = $request_params_sim;
			$res = main($request_params);
			$prize = $server_response["current_round"]["prize_value"];
			$win_mul = $server_response["current_round"]["total_fs_win"];
            while($server_response["current_round"]["prize_value"] != "exit"){
                $pick_pos += 1;
                $bonus_game_id = $resp[0]['bonus_game_id'];
                $request_params_sim['game_id'] = $game_id;
                $request_params_sim['amount_type'] = 1;
                $request_params_sim['coin_value'] = $coin_value_sim;
                $request_params_sim['num_coins'] = $num_coins_sim;
                $request_params_sim['num_betlines'] = $num_betlines_sim;
                $request_params_sim['username'] = $username_sim;
                $request_params_sim['session_id'] = "";
                $request_params_sim['platform_type'] = "desktop";
                $request_params_sim['request_type'] = 6;
                $request_params_sim['sub_game_id'] = "1";
                $request_params_sim['pick_position'] = $pick_pos;
                $request_params_sim['bonus_game_id'] = $bonus_game_id;
                $_POST = $request_params_sim;
                $request_params = $request_params_sim;
                $res = main($request_params);
				// print_r($server_response);

				// echo $server_response["current_round"]["prize_value"];
            }

			// echo $server_response["current_round"]["prize_value"];
			if($server_response["current_round"]["total_fs_win"]){
				// echo "total ". $server_res	ponse["current_round"]["total_fs_win"];
				$totalBonusWin += $server_response["current_round"]["total_fs_win"];
			}
		}

		if ($resp[0]['bonus_game_id'] == 380003) {
            $pick_pos = 1;
			$nacro_bonus2 += 1;
            $bonus_game_id = $resp[0]['bonus_game_id'];
			$request_params_sim['game_id'] = $game_id;
			$request_params_sim['amount_type'] = 1;
			$request_params_sim['coin_value'] = $coin_value_sim;
			$request_params_sim['num_coins'] = $num_coins_sim;
			$request_params_sim['num_betlines'] = $num_betlines_sim;
			$request_params_sim['username'] = $username_sim;
			$request_params_sim['session_id'] = "";
			$request_params_sim['platform_type'] = "desktop";
			$request_params_sim['request_type'] = 6;
			$request_params_sim['sub_game_id'] = "1";
			$request_params_sim['pick_position'] = $pick_pos;
			$request_params_sim['bonus_game_id'] = $bonus_game_id;
			$_POST = $request_params_sim;
			$request_params = $request_params_sim;
			$res = main($request_params);
			// print_r($server_response);
			$prize = $server_response["current_round"]["prize_value"];
			$win_mul = $server_response["current_round"]["total_fs_win"];
			// if( )
            while($server_response["current_round"]["prize_value"] != "exit"){
                $pick_pos += 1;
                $bonus_game_id = $resp[0]['bonus_game_id'];
                $request_params_sim['game_id'] = $game_id;
                $request_params_sim['amount_type'] = 1;
                $request_params_sim['coin_value'] = $coin_value_sim;
                $request_params_sim['num_coins'] = $num_coins_sim;
                $request_params_sim['num_betlines'] = $num_betlines_sim;
                $request_params_sim['username'] = $username_sim;
                $request_params_sim['session_id'] = "";
                $request_params_sim['platform_type'] = "desktop";
                $request_params_sim['request_type'] = 6;
                $request_params_sim['sub_game_id'] = "1";
                $request_params_sim['pick_position'] = $pick_pos;
                $request_params_sim['bonus_game_id'] = $bonus_game_id;
                $_POST = $request_params_sim;
                $request_params = $request_params_sim;
                $res = main($request_params);
				// print_r($server_response);

				// echo $server_response["current_round"]["prize_value"];
            }

			// echo $server_response["current_round"]["prize_value"];
			if($server_response["current_round"]["total_fs_win"]){
				// echo "total ". $server_res	ponse["current_round"]["total_fs_win"];
				$totalBonusWin2 += $server_response["current_round"]["total_fs_win"];
			}
		}
		
	}
	
	$round_bet_amount = 0; $round_win_amount = 0; $round_data = array();
										// if($i % 1000 === 0 ) {
										// 	move_freespins_logs($game_id);
										// }
										
		// $server_response = array();
		#========================================
		// $coin_values = array(1,2,5,10,20,50,100,200,500);
		// $index = array_rand($coin_values);
		// $coin_value_sim = $coin_values[$index];
		// $request_params['coin_value'] = $coin_value_sim;
		// $arr[$coin_value_sim.""] += 1;
		#=============================
		// $resp = main($request_params);
		// write round data into the CSV file.
			// log_round_data($round_data, $csv_file_obj);
			
												// find_bonus_wins($server_response, $cycle, $fs_details);
												
												// set_request_params($server_response);
		// 	if($i % 100000 === 0 ) {
		// print "\n ($i). ($cycle) Bet=> $total_bet_simulation;" .
		// 	" Win: $totalNormalWin  ";
		// 		// ($totalNormalWin / $total_bet_simulation ) * 100;
		// 	}
												/*if($i % 10000 === 0 ) {
													$print1 = "\n ($i)  Bet: $total_bet_simulation;".
													" Win: $total_win_simulation  ".
													($total_win_simulation / $total_bet_simulation ) * 100;
													print $print1;
													
													write_rtp_csv($i, $total_win_simulation, $total_bet_simulation,
													($total_win_simulation / $total_bet_simulation ) * 100, $csv_obj_rtp);
												}*/
			
			
			// echo "<br>";
			// echo $i."win = ".$total_win_simulation."bet = ".$total_bet_simulation ;
			// collect_rtp_count($i, ($totalNormalWin / $total_bet_simulation ) * 100 );
			// $curr_rtp = round(($totalNormalWin / $total_bet_simulation ) * 100);

			// if( $prev_rtp != $curr_rtp && $curr_rtp > 97 ) {
			// 	write_rtp_csv($i, $totalNormalWin, $total_bet_simulation, $curr_rtp, $rtp_change_csv_file);
			// }

			// $prev_rtp = $curr_rtp;
			// # After every 1m collect the simulation data.
			// if($i % 1000000 === 0 ) {
			// 	log_cycle_data($log_file, $i, $totalNormalWin, $total_bet_simulation);
			// }
			// // set_request_params($server_response);
			// clear_bonus_freespins($game_id);

}

// function find_bonus_wins($server_response, &$cycle, &$fs_details) {
// 	global $rtps;

// 	if (isset($server_response['current_round']['bonus_games_won']) &&
//          count($server_response['current_round']['bonus_games_won']) > 0) {
// 		foreach ($server_response['current_round']['bonus_games_won'] as  $key => $bonus_game) {
// 			if (isset($bonus_game['type']) && $bonus_game['type'] == 'respin' 
// 											|| $bonus_game['type'] == 'freespins') {

// 	            $cycle += $bonus_game['num_spins'];

// 	        }
// 		}
// 	}
// }

function clear_bonus_freespins($game_id = 701) {
	global $db, $account_id;

	$qry = "DELETE FROM gamelog.freespins where game_id = {$game_id} and account_id = {$account_id} and timestamp = '2023-04-03 14:34:37'";
	$db->runQuery($qry);

// 	$qry = "DELETE FROM gamelog.forcing_data";
// 	$db->runQuery($qry);

	$qry = "DELETE FROM gamelog.bonus_games where game_id = {$game_id} and account_id = {$account_id} and timestamp = '2023-04-03 14:34:37'";
	$db->runQuery($qry);

	$qry = "DELETE FROM gamelog.sticky_wins where game_id = {$game_id} and account_id = {$account_id} and timestamp = '2023-04-03 14:34:37'";
	$db->runQuery($qry);
// }
// function move_freespins_logs($game_id) {
// 	global $db, $account_id;

	// $qry = "select id from gamelog.freespins where state = 1 and game_id = {$game_id} and account_id = {$account_id} order by id desc limit 10, 1";
	// $rs = $db->runQuery($qry);
	// $row = $db->fetchAssoc($rs);
	// $row_id = $row['id'];

	$qry = "delete from gamelog.freespins where game_id = {$game_id}  and account_id = {$account_id} AND state = 1 and timestamp = '2023-04-03 14:34:37'";
	$db->runQuery($qry);

	// $qry = "select id from gamelog.bonus_games where state = 1 and game_id = {$game_id}  and account_id = {$account_id} order by id desc limit 10, 1";
	// $rs = $db->runQuery($qry);
	// $row = $db->fetchAssoc($rs);
	// $row_id = $row['id'];

	$qry = "delete from gamelog.bonus_games where game_id = {$game_id}  and account_id = {$account_id} AND state = 1 and timestamp = '2023-04-03 14:34:37'";
	$db->runQuery($qry);
}
function open_csv_file($game_name) {
	global $date_time;

	$outcome_file = $game_name."_logs_".$date_time . ".csv";
    $csv_file = fopen($outcome_file, 'w'); // Open the file in write mode.
    $csv_file_heareds = array('RoundId', 'TimeStamp', 'GameID', 'StopPositions',
                            'MatrixSymbols', 'PlayType', 'BetAmount', 'WinAmount');
    fputcsv($csv_file, $csv_file_heareds, ',');

    return $csv_file;
}
function log_round_data($row_data, &$file_obj) {
	fputcsv($file_obj, $row_data, ',');
}
/*
 * @fun log_simulation_round   simcode
 * Only for simulation to write a row in the CSV file.
 * row will contain the details from current round.
 */
function log_simulation_round($game, $round) {
  global $round_bet_amount, $round_win_amount, $round_data;


  $stoppositions = '';

  if(is_array($round->reelPointers)) {
    $stoppositions = implode(';', $round->reelPointers);
  }

  $round_id = $round->roundId;
  if($round->spinType == 'bonus') {
	  $round_id = $round->bonusGames['round_id'];
  }

  $round_data = array(
                    $round_id,
                    time(),
                    $game->gameId,
                    $stoppositions,
                    $round->matrixString,
                    $round->spinType,
                    $round_bet_amount,
                    $round_win_amount
                  );

  return;
}
function collect_rtp_count($num_spin, $rtp) {
	global $rtp_set;
	$curr_spin_rtp = round($rtp);

	if($curr_spin_rtp < 90) {
		$rtp_set['a']++;
	}
	else if($curr_spin_rtp > 105 && $curr_spin_rtp <= 110 ) {
		$rtp_set['b']++;
	}
	else if($curr_spin_rtp > 110) {
		$rtp_set['c']++;
	}
	else {
		$rtp_set[$curr_spin_rtp]++;
	}

}

function get_csv_file($game_name) {
	global $date_time, $username_sim;

	$file_name = $game_name.'_'.$date_time.'_'.$username_sim.'.csv';
	$csv_file = fopen($file_name, 'w');
	$csv_file_heareds = array('Num Spins', 'Win', 'Bet', 'RTP');
	fputcsv($csv_file, $csv_file_heareds, ',');

	return $csv_file;
}

function write_rtp_csv($num_spins, $win, $bet, $rtp, &$file_obj) {
	$data = array($num_spins, $win, $bet, $rtp);
	fputcsv($file_obj, $data, ',');
}
function log_cycle_data($log_file, $cycle, $total_win_simulation, $total_bet_simulation) {
	global $rtps, $round_bet_amount, $bonus_sym_win, $sim_fs_game_mult, $bonus_win_sym;

	fwrite($log_file, "\n Cycle completed : $cycle \n");
	fwrite($log_file, "\n RTP : ".round(($total_win_simulation / $total_bet_simulation ) * 100, 2 )."\n");
	fwrite($log_file, print_r($rtps, true));
	fwrite($log_file, " \n ");
	fwrite($log_file, "\n Round Bet Amount: $round_bet_amount .. Bonus symb win: $bonus_sym_win....\n");
	fwrite($log_file, " \n xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \n ");
	fwrite($log_file, '\n --- sim_fs_game_mult ----\n');
	fwrite($log_file, print_r($sim_fs_game_mult, true));
	fwrite($log_file, '---------------------------\n');

	fwrite($log_file, '\n --- Bonus win details ----\n');
	fwrite($log_file, print_r($bonus_win_sym, true));
}
$end_date_time = date("M,d,Y h:i:s A");

$end_time = time();
$execution_time = $end_time - $start_time;
echo "<br>";
$total_sctter = $three_scatter*2*30;
$total_win_simulation = $totalNormalWin + $totalFreeGameWin + $total_sctter+$totalBonusWin+$totalBonusWin2;
$print4 = "\n\n\n Initial Cycle   :".$initial_cycle.
"\n Total Cycle :  ".$cycle.
"\n Total Bet :  ".$total_bet_simulation.
"\n Normal Win    :".$totalNormalWin.
"\n Total Three Scatter    :".$three_scatter.
"\n Total Bonus     :".$nacro_bonus.
"\n Total Bonus 2    :".$nacro_bonus2.
"\n Total Scatter Win    :".$total_sctter.
"\n FreeSpin Win    :".$totalFreeGameWin.
"\n Bonus Win    :".$totalBonusWin.
"\n Bonus Win 2   :".$totalBonusWin2.
"\n bonus_multiplier    :".$bonus_multiplier.
		  "\n Total Win : ".$total_win_simulation.
		  "\n RTP  : ".  round(($total_win_simulation / $total_bet_simulation ) * 100, 2).
		  "\n Normal RTP  : ".  round(($totalNormalWin / $total_bet_simulation ) * 100, 2).
		  "\n FG RTP  : ".  round(($totalFreeGameWin / $total_bet_simulation ) * 100, 2).
		  "\n Bonus RTP  : ".  round(($totalBonusWin  / $total_bet_simulation ) * 100, 2).
		  "\n Bonus 2RTP  : ".  round(($totalBonusWin2  / $total_bet_simulation ) * 100, 2).
		  "\n Scatter RTP  : ".  round(($total_sctter / $total_bet_simulation ) * 100, 2).
		  "\n Start Time : ".$start_date_time.
		  "\n Start Time : ".$repeat_num_FS.
		  "\n Base Game Repeat : ".json_encode($repeat_num_Normal).
		  "\n FreeGame Game Repeat : ".json_encode($repeat_num_Normal).
		  "\n Total Time taken in seconds: " . $execution_time.
		  "\n Total Time taken in min: " . ($execution_time / 60 ).
		  "\n Total Time taken in hours: " . ( $execution_time / (60 * 60) ) . "\n\n";

print $print4;
print_r($rtps);
print_r($rtp_set);
print_r($win_distribution);
print_r($bet_distribution);
print_r($maxWin);
fwrite($log_file, print_r($print4, true));
fwrite($log_file, print_r($rtps, true));
// fwrite($log_file, print_r($fs_details, true));
fwrite($log_file, print_r($win_distribution, true));
fwrite($log_file, print_r($bet_distribution, true));
fwrite($log_file, print_r($maxWin, true));
?>
