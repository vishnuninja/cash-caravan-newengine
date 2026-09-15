<?php
require_once 'ibonus.inc.php';

/**
 * @class SpawningWild
 * @implements iBonus
 * @desc This class is used for the game Wrath of the Dragons.
 *       Gets called for the bonus game Spawning Wilds.
 */

class SpawningWild implements iBonus
{
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount)
    {
        $this->game = $game;
        $this->round = &$round;
        $this->accountId = $accountId;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->scattersCount = $scattersCount;
    }

    /**
     * @func checkAndGrantBonusGame
     * @desc Gets called when there are 3 or more bonus symbols in screen.
     *       It awards free spins at the end of the bonus game
     */
    public function checkAndGrantBonusGame()
    {
      $details = $this->round->featureData['details'];
      $bonus_symbol = $details['bonus_symbol'];

      $num_bonus_symbols = 0;
      if(in_array($bonus_symbol, $this->round->matrixFlatten)) {
        $num_bonus_symbols = array_count_values($this->round->matrixFlatten)[$bonus_symbol];
      }

      # check: number of bonus symbols must be less than 3
      if(!in_array($num_bonus_symbols, $details['eligible_num_symbols'])) {
        return;
      }

      $weights = $details['weights'];
      $num_wild_reels = $details['num_wild_reels'];

      # Probability check
      # Determine how many reels can become spawning wild reels
      $num_spawning_reels = weighted_random_number($weights, $num_wild_reels);

      if($num_spawning_reels === 0 || $num_spawning_reels == 0 || !$num_spawning_reels) {
        return;
      }

      $flipped_matrix = flip_2d_array($this->round->matrix);
      $reel_indexes = Array();

      for($i = 0; $i < $this->game->numColumns; $i++) {
        array_push($reel_indexes, $i);
      }

      # Wild reel can spawn any reel from 0 to machine's num_reels
      # Values will range from 0 to $game->numColumns
      shuffle($reel_indexes);

      $min_spawn_wild_reel_index = $reel_indexes[0];
      $max_reel_index = $reel_indexes[0];
      $choosen_reel_indexs = Array();

      for($i = 0; $i < $num_spawning_reels; $i++) {
        $reel_index = $reel_indexes[$i];

        $flipped_matrix[$reel_index] = array_fill(0, $this->game->numRows,
          $details['spawning_wild_symbol']);

        if($reel_index <= $min_spawn_wild_reel_index) {
          $min_spawn_wild_reel_index = $reel_index;
        }

        if($reel_index > $max_reel_index) {
          $max_reel_index = $reel_index;
        }

        array_push($choosen_reel_indexs, $reel_index);
      }

      $this->round->wildMultiplier = $max_reel_index + 1;
      $this->round->multipliers = Array(
          Array(
              "type" => "wild_multiplier",
              "id"  => $this->round->featureData['bonus_game_id'],
              "value" => $max_reel_index + 1));

      $matrix = flip_2d_array($flipped_matrix);
      $this->round->postMatrixInfo = Array(
        'matrix'        => $matrix,
        'feature_name'  => 'spawning_wild',
        'matrixString'  => array2d_to_string($matrix),
        'matrixFlatten' => $this->round->generateFlatMatrix($matrix));

      sort($choosen_reel_indexs);
      $moving_wilds_data = get_walking_wild_data($choosen_reel_indexs);
      $fs_game_ids = $this->getFSGameIds($choosen_reel_indexs);

      /**
       * 0, 1, 2, 3, 4
       * Num re-spins to award: $game->numColumns - (min_spawn_wild_reel_index + 1)
       * To load re-spin reelset ID during re-spins
       * $game->numColumns - $spins_left => 5 - 4 = 1
       * $game->numColumns - $spins_left => 5 - 3 = 2
       * $game->numColumns - $spins_left => 5 - 2 = 3
       * $game->numColumns - $spins_left => 5 - 1 = 4
       */

      $num_respins = $this->game->numColumns - ($min_spawn_wild_reel_index + 1);
      if($num_respins <= 0) {
        return;
      }


      $multiplier = 1; # todo get this mult dynamically from configuration
      $base_round_id = $this->round->roundId; # parent_spins_left
      $round_ids = Array($this->round->roundId);
      $history = Array($num_respins);
      $spinType = 3;
      $parentSpinType = $this->round->getParentSpinType();
      $rs_details = Array(
          "spin_type" => "respin",
          "parent_type" => $parentSpinType,
          "bonus_game_id" => $details['bonus_game_id'],
          "moving_wilds_data" => $moving_wilds_data,
          "fs_game_ids" => $fs_game_ids);

      if(isset($this->round->freeSpins) and isset($this->round->freeSpins['base_round_id'])) {
        $base_round_id = $this->round->freeSpins['base_round_id'];
      }

      $parent_spins_left = $this->getParentSpinsLeft();
      if($parent_spins_left >= 0) {
          $rs_details['parent_spins_left'] = $parent_spins_left;
      }

      if($parentSpinType == 'freespins') {
          $rs_details['parent_id_primary'] = $this->round->freeSpins['id'];
      }

      award_freespins($this->game->gameId, $this->game->subGameId,
                      $this->round->player->accountId, $base_round_id,
                      $num_respins, $multiplier, $this->round->coinValue,
                      $this->round->numCoins, $this->round->numBetLines,
                      $this->round->amountType, $round_ids, $history, $spinType, $rs_details);


      $respins_info = Array('type' => 'respins', 'num_spins' => $num_respins,
                            'spins_left' => $num_respins, "win_amount" => 0,
                            "parent_type" => $parentSpinType);

      array_push($this->round->bonusGamesWon, $respins_info);
    }

    private function getParentSpinsLeft() {
        if(isset($this->round->freeSpins) && $this->round->freeSpins['spin_type'] == 2) {
            if($this->round->freeSpins['spins_left'] == 1) {
               return 0;
           }
           else {
               return $this->round->freeSpins['spins_left'];
           }
       }
       return -1;
    }

    /**
     * @func playBonusGame
     * @desc Nothing happends here
     * @param $feature_position value ranges between 0 and total_objects -1.
     */
    public function playBonusGame($pickedPosition)
    {
      return;
    }

    /**
     * @func load
     * @desc This public function is used to accumulate the values which will be
     *       required by client to load the bonus game. This bonus has more than
     *       1 click hence it is sending the prizes won to the client.
     */
    public function loadBonusGame()
    {
      return;
    }

    private function getFSGameIds($reel_indexes) {
        $reel_indexes_str = implode("", $reel_indexes);
        $fs_game_ids = Array(
				'0'		=> Array(2, 3, 4, 5),
				'1'		=> Array(3, 4, 5),
				'2'		=> Array(4, 5),
				'3'		=> Array(5),
				'4'		=> Array(),
				'01'	=> Array(3, 4, 5, 6),
				'02'	=> Array(4, 5, 6, 5),
				'03'	=> Array(5, 6, 4, 5),
				'04'	=> Array(6, 3, 4, 5),
				'12'	=> Array(4, 5, 6),
				'13'	=> Array(5, 6, 5),
				'14'	=> Array(6, 4, 5),
				'23'	=> Array(5, 6),
				'24'	=> Array(6, 5),
				'34'	=> Array(6),
				'012'	=> Array(4, 5, 6, 6),
				'013'	=> Array(5, 6, 5, 6),
				'014'	=> Array(6, 4, 5, 6),
				'023'	=> Array(5, 6, 6, 5),
				'024'	=> Array(6, 5, 6, 5),
				'034'	=> Array(6, 6, 4, 5),
				'123'	=> Array(5, 6, 6),
				'124'	=> Array(6, 5, 6),
				'134'	=> Array(6, 6, 5),
				'234'	=> Array(6, 6),
				'0123'	=> Array(5, 6, 6, 6),
				'0124'	=> Array(6, 5, 6, 6),
				'0134'	=> Array(6, 6, 5, 6),
				'0234'	=> Array(6, 6, 6, 5),
				'1234'	=> Array(6, 6, 6),
				'01234'	=> Array(6, 6, 6, 6));

        if(isset($fs_game_ids[$reel_indexes_str])) {
            return $fs_game_ids[$reel_indexes_str];
        }
        else {
            ErrorHandler::handleError(1, "SPAWNING_00011");
        }
    }
}
?>
