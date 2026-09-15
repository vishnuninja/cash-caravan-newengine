<?php
require_once 'message_handler.php';
require_once 'spin_handler.php';
require_once 'extraFgSpins.php';
require_once 'bonus_handler.php';
require_once 'default_handler.php';
require_once 'database.inc.php';
require_once 'rng.lib.php';
require_once 'paylines.php';
require_once 'casino.lib.php';
require_once 'casino_constants.php';

$db = Database::getObject('core');

$game_handlers = Array(
	"stickywildreel" => "handle_sticky_wild_reel", # Egypt Clyopatra
	"expanding_wild" => "handle_expanding_wild",
	"expanding_wilds_on_reels" => "handle_expanding_wilds_on_reels", # Master of Fortune
	"expanding_wild_freespins" => "handle_expanding_wild_freespins",
	"screen_wins" => "handle_screen_wins",
	"freespins" => "handle_freespins",
	"postfreespins" => "handle_post_freespins_prizes",
	"freespins_candyburst" => "handle_freespins_candyburst", ////////////////////
	"spawning_wild_candy_burst" => "handle_spawning_wild_candy_burst", //Candy Burst
	"walking_wilds" => "handle_walking_wilds",
	"default_handler" => "handle_default_handler",
	"freespins_chinesedynasty" => "handle_freespins_chinesedynasty", // To handle the freespin feature in chinesedynasty
	"respin_chinesedynasty" => "handle_respin_chinesedynasty", // To insert respin round into DB. To update the respin details into DB after re spinning the done.
	"respin_round_chinesedynasty" => "handle_respin_round_chinesedynasty", // Called from the post matrix feature to modify the matrix the for the respin. Respin always happens with modified matrix(Old won symbols are retained)
	"base_game_random_feature" => "handle_base_game_random_feature", // Davincy
	"pickedStickyFeature" => "handle_reel_position", # TerraCotta, olympiangolds
	"check_nacro_bonus" => "check_nacro_bonus", # TerraCotta
	"createstickyfeature" => "generate_random_wild", # KattanaWarrior, olympiangolds
	"freespin_katana" => "handle_freespins_katana", # KattanaWarrior
	"check_special_symbol_win" => "check_special_symbol_win", # KattanaWarriorn
	"pickwildstickyfeature" => "handle_sticky_wild_feature", # sekhmet
	"freespin_lotr" => "handle_freespins_lotr", # LOTR
	"multipler_feature" => "multipler_feature", # Bonza
	"freespins_bonaza" => "handle_freespins_bonaza", # Bonza
	"max_win_cap" => "handle_max_win_cap", # Bonza
	"pickwildmultiplier" => "handle_wild_multiplier", # dog / wild_gang
	"reelset" => "reelset_change", # wild_gang
	"deside_wild_mystry" => "select_wild_mystry", # wild_gang
	"deside_symbol" => "deside_wild_or_scatter", # wild_gang
	"mystrySymbol" => "handle_special_symbol", # wild_gang
	"freespin_wild_gang" => "handle_freespins_wild_gang", # wild_gang
	"freespins_dog_house" => "handle_freespins_dog_house", # fg_dog


	);

$bonus_game_handlers = Array(
	3001 => "SpawningWild",     # Wrath Spawning Wild.
	3002 => "WalkingWilds",     # Wrath Walking Wild during free spins.
	6001 => "WellBonusGame",    # Leprachauns Loot Pick Bonus. Grants freespins.
	6002 => "RoadBonusGame",    # Leprachauns Loot. Road Bonus Game.
	5001 => "PickBonusGame",    # Davinicy. For 6003
	9001 => "PickMeBonus",      # Chinese New Year
	10001 => "BonusPickGame",   # Inifinity Battle
	10002 => "PostMatrixPrizes",# Inifinity Battle
	10003 => "PostWinHandler",  # Inifinity Battle
	12001 => "PickBonusProsperity", # Guardianofprosperity
	12002 => "QueuedBonus",         # Guardianofprosperity
	12003 => "RandomWild",          #
	13001 => "MysteryReplace",      # Festival Of Fortune
	14001 => "PostExpandWin",       # Legend Of Horus
	14002 => "PickBonusSym",        # Legend Of Horus
	14003 => "PickExpandSym",		# Mystic Ocean
	19001 => "BonusPickFeature",	# FruityTwister
	19002 => "PostMatrixFeatures",  # FruityTwister
	19003 => "PostRageBoost",		# FruityTwister
	20001 => "PickFreeGame",		# PMR
	20002 => "FreeModes",			# PMR
	20003 => "PickPlay",			# PMR
	21001 => "Avalanche",           # The Dark
	22001 => "CollectionSymbol", 	# Shelbyonlinevideoslot
	22002 => "PickAndClick", 		# Shelbyonlinevideoslot
	23001 => "ReSpinTriger",		# SkullsGoneWild
	24001 => "AvalancheChess",		# VikingsChess
	24002 => "SpreadingWild",		# VikingsChess
	25001 => "PostVegas",			# Vegas Time
	25002 => "PostVegasBonus",		# Vegas Time
    26001 => "BankHeist",           # BH
	1193001 => "ProgressBarDBZ",
	1194001 => "RichesFeature",
    1197001 => "RandomWildCombination",	# POGL
    1197002 => "ExpandBonusSymbol",		# POGL
	2001 =>  "SpinMultiplier",		#
	26001 => "MiyabiFeature",		# QS
	26002 => "ConsecutiveWinsHandler",# QS
	28001	=> "PickJackpotFeature",# Ninja Gold
	28002	=> "PostWinJackpotFeature", 	# Ninja Gold
	380001	=> "PickOneJackpot", 	# TeraCotta, kamakura, olymgolds
	380002	=> "NacroPollsBonus", 	# TeraCotta
	380003	=> "NacroPollsBonus", 	# TeraCotta
	380004	=> "BonusGameFeature", 	# medusaferry
	380005	=> "LightningFeature", 	# LOTR
	380006	=> "BaseGameMystryFeature", # LOTR
	380007	=> "WildMultiplierPay", 	# dog

	);

$line_win_handler = Array(
	4001 => 'Cluster', // Candy
	23003 => 'Skulls',
	24003 => 'Chess',
	24004 => 'SymbolWin',           #new
	1197003 => 'WildPayoutHandler',		# POGL
);

$bet_line_handlers = Array(
	12004 => "WaysBetlines",
	12005 => "SymbolCountLines",  #new
	12006 => "WaysBetreel",
);

$misc_handlers = Array(
	2001 =>  "SpinMultiplier",		# Progressive Multipliers
);

function get_bet_line_handlers() {
	global $bet_line_handlers;

	return $bet_line_handlers;
}

function get_line_win_handlers() {
	global $line_win_handler;

	return $line_win_handler;
}

function get_bonus_game_handlers() {
	global $bonus_game_handlers;

	return $bonus_game_handlers;
}

function is_valid_misc_bonus_game_id($bonus_game_id) {
	global $misc_handlers;

	if(isset($misc_handlers[$bonus_game_id])) {
		return true;
	}

	return false;
}
?>
