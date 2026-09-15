<?php
define("INI_FILE", "feature.ini");

require_once 'betlines/default_betlines.inc.php';
require_once 'betlines/ways_betlines.inc.php';
require_once 'betlines/ways_betreel.inc.php';
require_once 'betlines/symbol_count.inc.php';

class BetLinesFactory
{
	private $game;
	private $round;

	public function __construct(&$game, &$round)
	{
		$this->game = $game;
		$this->round = $round;
	}

	public static function getBetLinesObject($game, $round)
	{	

		$betlines_factory = new BetLinesFactory($game, $round);
		// echo "!";
		// print_r($betlines_factory->getObject());
		// echo "!";
		return $betlines_factory->getObject();
	}

	public function getObject($default_class = 'DefaultBetLines')
	{
		$betline_config = $this->game->misc;
		
		$betline_id = isset($betline_config['betlines_handler_id']) ? 
					$betline_config['betlines_handler_id'] : null;
		$handlers = get_bet_line_handlers();
		$classname = empty($handlers[$betline_id]) ? $default_class : $handlers[$betline_id];

		return new $classname($this->game, $this->round);
	}
}
?>