<?
  ## THIS FILE IS INCLUDED IN THE SLOTS MAIN FILE AND THESE VARIABLES WILL BE USED TO FORCE THE GAME OUTCOME
 

  include_once "access.php";
  $account_id = $_SESSION['account_id'];
  if(!$account_id) {
	//print json_encode(array('error'=>10, 'error_message'=>'Your session expired. Please login again'));
	//exit;
	SlotsError::errorToClient(10, 'Your session expired. Please login again.');
  }

  $db_slots_hardcode  = "";
  $query  = "SELECT account_id, config_id, game_name, reelstr from $db_slotshardcode_forcedaccount WHERE account_id=$account_id AND expiry_date > NOW()";
  
  $result = mysql_query($query) or die('ERROR in slots harcode.php');;
  $row  = mysql_fetch_row($result);
  if($row!==FALSE)
  {
    $slothardcode_config_id       = $row[1];
    $slothardcode_name            = $row[2];
    $slothardcode_reels_pointers  = $row[3];
  }
  else
  {    
	  $key = "slotforced";
	  $slothardcode_config_id       =	$_SESSION[$key]['config_id'];	
	  $slothardcode_reels_pointers	=	$_SESSION[$key]['positions'];	
	  $slothardcode_name		        =	$_SESSION[$key]['name'];
  }

 // print_r($_SESSION); 
?>
