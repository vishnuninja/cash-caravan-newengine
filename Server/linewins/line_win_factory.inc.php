<?php
require_once 'cluster.php';
require_once 'skulls.php';
require_once 'chess.php';
require_once 'wildpayouthandler.php';
require_once 'symbol_win.php';

class LineWinFactory {
	private $game;
	private $round;
	private $player;

	public function __construct(&$game, &$round, &$player) {
		$this->game = $game;
		$this->round = $round;
		$this->player = $player;
	}

	public static function getLineWinObject(&$game, &$round, &$player) {
		$base_game_factory = new LineWinFactory($game, $round, $player);

		return $base_game_factory->getObject();
	}

	public function getObject() {
		$line_win_id = isset($this->game->misc['linewin_handler_id']) ?
						$this->game->misc['linewin_handler_id'] : '';

		if(!$line_win_id) {
			return ;
		}

		$handlers = get_line_win_handlers();
		$class_name = empty($handlers[$line_win_id]) ? '' : $handlers[$line_win_id];

		return new $class_name($this->game, $this->round, $this->player);
	}
}

?>
