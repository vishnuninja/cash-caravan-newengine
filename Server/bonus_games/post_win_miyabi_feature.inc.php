<?php
/**
 * @class PostWinMiyabiFeature
 * @implements iBonus
 * @desc This class is used for the game Queen Of Legends.
 *       Gets called for the Post Win Miyabi Feature
 */

class PostWinMiyabiFeature extends MiyabiFeature {
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;
    protected $otherPrizeRound;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount)
    {
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->game = $game;
        $this->round = &$round;
        $this->accountId = $accountId;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $this->scattersCount = $scattersCount;
        $this->otherPrizeRound = Array();
    }

    /**
     * @func checkAndGrantBonusGame
     */
    public function checkAndGrantBonusGame() {
        // Need to add in casino.php
        $this->loadOtherPrizes();

        $win_amount = $this->round->winAmount;
        $details = $this->round->featureData['details'];
        $min_count = $details['min_count'];
        $parent_round_id = 0;

        $details = Array();

        if (empty($this->otherPrizeRound)) {
            if ($win_amount > 0) {
                $details = Array(
                    $this->round->coinValue => 1
                );
                $this->grant_other_prizes($this->game->gameId, $this->accountId,
                 $parent_round_id, $this->round->spinType, $details);
            }
        } else {
            $details = $this->otherPrizeRound['details'];
            if ($win_amount > 0) {
                if (in_array($this->round->coinValue, array_keys($details))) {
                    $details[$this->round->coinValue] += 1;
                } else {
                    $details[$this->round->coinValue] = 1;
                }
            } else {
                $details[$this->round->coinValue] = 0;
            }

            // check consecutive wins
            foreach ($details as $key => $value) {
                if ($details[$key] == $min_count) {
                    $this->checkRespins();
                    $details[$key] = 0;
                }
            }
            $this->updateOtherPrizes($this->otherPrizeRound['id'], $this->game->gameId,
                $this->accountId, $parent_round_id, $this->round->spinType, $details);
        }
    }

    private function checkRespins() {
        $miyabi_details = $this->respinData();
        $princess_symbol = $miyabi_details['princess_symbol'];
        $blank_symbol = $miyabi_details['blank_symbol'];
        $sticky_reel = $miyabi_details['sticky_reel'];
        $num_spins = $miyabi_details['num_respins'];
        $multiplier = $miyabi_details['multiplier'];
        $this->awardRespins($sticky_reel, $num_spins, $princess_symbol, $blank_symbol, $multiplier);
    }

    // Need to add in casino.lib.php
    public function grant_other_prizes($game_id, $account_id, $parent_round_id, $spin_type, $details) {
        global $db;
        $details = encode_objects($details);
        $table_name = 'gamelog.other_prizes';

        $query = <<<QUERY
        INSERT INTO {$table_name}(game_id, account_id, parent_round_id, spin_type, details)
        VALUES ($game_id, $account_id, $parent_round_id, '$spin_type', '{$details}')
        QUERY;
        $result = $db->runQuery($query) or ErrorHandler::handleError(1, "STICKY_001");
    }

    // Need to add in round.php
    public function loadOtherPrizes() {
        global $db;
        $gameId = $this->game->gameId;
        $accountId = $this->accountId;
        $tableName = 'gamelog.other_prizes';

        $Query = <<<QUERY
            SELECT id, game_id, account_id, parent_round_id, spin_type, details
            FROM {$tableName}
            WHERE account_id = {$accountId} AND
                  game_id = {$gameId}
            ORDER BY id DESC LIMIT 1
        QUERY;

        $result = $db->runQuery($Query) or ErrorHandler::handleError(1, "POSTWIN_001");
        if($db->numRows($result) <= 0)
            return;

        $row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "POSTWIN_002");

        $this->otherPrizeRound['id'] = $row['id'];
        $this->otherPrizeRound['game_id'] = $row['game_id'];
        $this->otherPrizeRound['account_id'] = $row['account_id'];
        $this->otherPrizeRound['parent_round_id'] = $row['parent_round_id'];
        $this->otherPrizeRound['spin_type'] = $row['spin_type'];
        $this->otherPrizeRound['details'] = decode_object($row['details']);
    }

    private function updateOtherPrizes($row_id, $game_id, $account_id,
     $parent_round_id, $spinType, $details) {
        global $db;
        $details = encode_objects($details);
        $query =<<<QUERY
            UPDATE gamelog.other_prizes
            SET details = '{$details}'

            WHERE id = {$row_id} AND
            game_id = {$game_id}
            AND account_id = {$account_id}
        QUERY;

        $result = $db->runQuery($query) or ErrorHandler::handleError(1, "MIYABI_001");
    }

    private function respinData() {
        $featureConfig = $this->game->bonusConfig;
        $postMatrixFeatures = $featureConfig['post_matrix_handlers'][$this->round->spinType];
        foreach($postMatrixFeatures as $index => $feature) {
            $featureName = $feature['feature'];
            $details = $feature['details'];
        }
        return $details;
    }
}
?>
