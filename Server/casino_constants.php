<?php
	# Engine Modes
	define('FORCING_ENABLED',        1); # todo TODO Must be False when in Prod
	define('ENGINE_MODE_PRODUCTION', 1); # todo TODO Must be True when in Dev / Prod
	// define('ENGINE_MODE_SIMULATION', 1); # todo TODO Must be True when in Dev / Prod

	# Game modes
	define('INIT_MODE',     1);
	define('PLAY_MODE',     2);
	define('BONUS_MODE',    3);
	define('GAMBLE_MODE',   4);
	define('ENDROUND_MODE', 5);
	define('OTHER_MODE',    6);
	define('COLLECT_MODE',  7);
	define('ExtraFSMode',  8);

	#Gamble modes
	define('COLOR_1', 1);
	define('COLOR_2', 2);
	define('COLLECT', 3);

	define("ENVIRONMENT", 'EAZY');
	# Player Transaction Types
	define('WAGERING', 1);
	define('WINNING',  2);

	# Spin/Play type
	define('SPINTYPE_DUMMY', 0);
	define('SPINTYPE_CASH',  1);
	define('SPINTYPE_BBS',   2);
	define('SPINTYPE_BOTH',  3);
	define('SPINTYPE_FEAT',  4);
	define('SPINTYPE_FREE',  5);

	# Spin Types
	define('SPINTYPE_NORMAL',   'normal');
	define('SPINTYPE_FREESPIN', 'freespin');

	$spin_types = Array('normal' => 1, 'freespin' => 2, 'respin' => 3);

	# Amount Type
	define('AMOUNT_TYPE_CASH', 1);
	define('AMOUNT_TYPE_BBS',  2);
	define('AMOUNT_TYPE_PFS',  3); // Promo Freespin
	define('AMOUNT_TYPE_FUN',  4); // fun_mode

	define('FUN_INIT_BAL', 1000);  // fun_mode
?>
