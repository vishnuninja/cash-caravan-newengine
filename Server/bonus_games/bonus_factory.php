<?php
require_once "road_bonus_game.inc.php"; # Leprechaun's Loot
require_once "well_bonus.inc.php";      # Leprechaun's Loot
require_once "spawning_wilds.inc.php";  # Wrath of the Dragons
require_once "walking_wilds.inc.php";   # Wrath of the Dragons
require_once "pick_bonus.inc.php";      # Age of Da Vinci
require_once "bonus_picks.inc.php";     # Inifinity Battle
require_once "post_matrix_prizes.inc.php";      # Inifinity Battle
require_once "post_linewin_handler.inc.php";    # Inifinity Battle
require_once "pick_bonus_prosperity.php";       # Guardianofprosperity
require_once "queued_bonus.inc.php";            # Guardianofprosperity
require_once "random_wild.inc.php";             # Guardianofprosperity
require_once "post_mystery_replace.inc.php";    # FestivalOfFortune
require_once "pickme_bonus_newyear.php";        # Chinese New Year
require_once "post_win_expand_symbol.php";      # LegendOfHorus
require_once "pick_bonus_symbol.php";           # LegendOfHorus
require_once "pick_expand_symbol.php";          # MysticOcean
require_once "bonus_pick_feature.inc.php";      # Fruitytwister
require_once "post_matrix_feature.inc.php";     # Fruitytwister
require_once "post_rage_boost.inc.php";			# Fruitytwister
require_once "post_collection_symbol.inc.php";	# Shelbyonlinevideoslot
require_once "post_pick_click.inc.php"; 		# Shelbyonlinevideoslot
require_once "pick_free_game.inc.php";			# PMR
require_once "post_free_play.inc.php";			# PMR
require_once "post_pick_play.inc.php";			# PMR
require_once "post_triger_respin.inc.php";		# SkullsGoneWild
require_once "post_avalanche.inc.php";          # The Dark
require_once "progress_bar_dbz.inc.php";        # DBZ
require_once "riches_feature.inc.php";
require_once "post_avalanche_chess.inc.php";    # Vikings Chess
require_once "post_spreding_wild.inc.php";    	# Vikings Chess
require_once "stacked_wilds.inc.php";			# VegasTime
require_once "post_vegas_bonus.inc.php";		# VegasTime
require_once 'post_bank_heist.inc.php';         # Bank Heist
require_once 'random_wild_combination_feature.inc.php'; # POGL
require_once 'expanding_bonus_symbol.inc.php';          # POGL
require_once 'progressive_multiplier.php';
require_once "miyabi_feature.inc.php";			# QS
require_once "consecutive_wins_handler.inc.php";	# QS
require_once "pick_jackpot_feature.inc.php";	# Ninja Gold
require_once "post_win_jackpot_feature.inc.php";# Ninja Gold
require_once "pick_one_jackpot.inc.php";# TERACOTA
require_once "nacro_polls_bonus.inc.php";# TERACOTA
require_once "lightning_feature.inc.php";# LOTR
require_once "mystry_reel.inc.php";# LOTR
require_once "bonusgame_Feature.inc.php";# medusa
require_once "wild_multiplier_pay.inc.php";# dog


// require_once "post_win_one_jackpot.inc.php";# TERACOTA

/**
 * @class BonusFactory
 *
 * This Class is helpfull in finding the specific bonus round class which handles
 * bonus round. This class has two public methods. They are
 *
 * Returns the object of the Bonus Game which will handles the bonus game.
 */
class BonusFactory
{
	# Game Object
	private $game;

	# Round Object
	private $round;

	/**
	 * @fn Constructor
	 *
	 * @desc Constructor of the Factory Class.
	 *
	 * @param $game
	 * @param $round
	 */
	public function __construct($game, &$round)
	{
		$this->game = $game;
		$this->round = $round;
		$this->bonusGameHandlers = get_bonus_game_handlers();
	}

	/**
	 * @fn getBonusObject
	 * @desc Static method gets called directly.
	 *
	 * @param $game
	 * @param $round
	 * @return Returns the object of Bonus game class
	 */
	public static function getBonusObject($game, &$round)
	{
		$object = null;
		$factoryObject = new BonusFactory($game, $round);
		list($symbol, $bonusGameId) = $factoryObject->getBonusGameId();
		if($symbol == null or $bonusGameId == -1) {
			return null;
		}

		$object = $factoryObject->getObjectFromId($bonusGameId, $symbol);
		return $object;
	}

	/**
	 * @fn getObjectFromId
	 * @desc Public method available outside
	 *
	 * @param $bonusGameId
	 * @param $symbol
	 * @return It returns object of the corresponding bonus game class
	 */
	public function getObjectFromId($bonusGameId, $symbol='')
	{
		$object = null;
		$handler = $this->bonusGameHandlers[$bonusGameId];
		if(!empty($handler)) {
			$object = new $handler($this->game,
								   $this->round,
								   $this->round->player->accountId,
								   $bonusGameId,
								   $symbol,
								   $this->round->scattersCount);
		}
		
		return $object;
	}

	# todo need to get rid of conditions based on game name
	private function getBonusGameId()
	{
		if(isset($this->game->misc['bonus_game_id'])) {
			$handler = $this->game->misc['bonus_game_id'];
			return $this->$handler();
		}
		return Null;
	}

	/**
	 * @fn getBonusGameIdTemp
	 * @desc Private method to get BonusGameID
	 *
	 * @return Returns the (symbol, bonusGameId) if bonusGame is configured else
	 *         returns -1
	 */
	private function getBonusGameIdTemp()
	{
		if(!isset($this->game->bonusConfig) or
		   !isset($this->game->bonusConfig['bonus_config']) or
		   !$this->game->bonusConfig['bonus_config']) {
			return Array(Null, -1);
		}

		$spinType = $this->round->spinType;
		

		if(!isset($this->game->bonusConfig['bonus_config']) or
		   !isset($this->game->bonusConfig['bonus_config'][$spinType]))
		{
			return Array(null, -1);
		}
		$configuration = $this->game->bonusConfig['bonus_config'][$spinType];
		foreach($this->round->scattersCount as $symbol => $count)
		{
			
			if(!isset($configuration[$symbol])) {
				continue;
			}

			if($count >= $configuration[$symbol]['min_count']) {
				
				return array(
					$symbol,
					$configuration[$symbol]['bonus_game_id']);
			}
		}

		return Array(null, -1);
	}
}
?>
