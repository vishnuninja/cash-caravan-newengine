<?php
require_once 'ibonus.inc.php';

/**
 * @class PostMatrixFeatures
 * @implements iBonus
 * @desc This class is used for the game Vikings.
 *       Gets called for the bonus game.
 */

class PostMatrixFeatures extends BonusPickFeature{
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

    public function checkAndGrantBonusGame($param='chest', $type='')
    {
        $spinType = $this->round->spinType;
        $featureConfig = $this->game->bonusConfig;
        $postMatrixFeatures = $featureConfig['post_matrix_handlers'][$spinType];
        $details = $postMatrixFeatures[0]['details'];

        $this->randomSymbolsReplace($details);
        $this->applyPostFeature($details);
        $this->handleTreasureChests($details);
        $this->applyFeature($details);
        if ($this->round->freeSpins && $this->round->queuedBonusGames
            && $this->round->freeSpins['spins_left'] ==1 ) {
            $this->awardBonusGame();
        } elseif ($this->round->freeSpins &&
            $this->round->freeSpins['spins_left'] ==1 ){
            $this->meters();
        }
    }

    private function randomSymbolsReplace($details)
    {
        $randSym = $details['random_symbols'];

        if(in_array($randSym[0], $this->round->matrixFlatten)
            || in_array($randSym[1], $this->round->matrixFlatten)) {

            $weights = $details['random_weights'];
            $values = $details['lowpay_symbols'];
            $sym = weighted_random_number($weights,$values);
            $sym1 = weighted_random_number($weights,$values);

            $matrix = $this->round->matrix;

            for($j=0; $j < $this->game->numColumns; $j++) {
                for($i=0; $i < $this->game->numRows; $i++) {

                    if($matrix[$i][$j] == $randSym[0]) {
                        $matrix[$i][$j] = $sym;
                    }
                    else if($matrix[$i][$j] == $randSym[1]){
                        $matrix[$i][$j] = $sym1;
                    }
                }
            }
            $this->round->matrix = $matrix;
            $this->round->matrixString = array2d_to_string($matrix);
            $this->round->matrixFlatten = $this->round->generateFlatMatrix($matrix);
        }
    }
    private function applyPostFeature($details)
    {
        if(isset($this->round->freeSpins))
        {
            $dtls = $this->round->freeSpins["details"];
            $wldReel = $dtls["pick_details"]["reels"];
            $wlds = $dtls["pick_details"]["wilds"];
            $chest = $details["chest"]["symbol"];
            $wild = $details["wild_symbol"];

            $matrix = $this->round->matrix;

            for($j=0; $j < $this->game->numColumns; $j++)
            {
                for($i=0; $i < $this->game->numRows; $i++)
                {
                    if($matrix[$i][$j] == $chest) {
                        continue;
                    }
                    else if(in_array($j, $wldReel)) {
                        $matrix[$i][$j] = $wild;
                    }
                    else if(in_array($j + ($i * $this->game->numColumns), $wlds))
                    {
                        $matrix[$i][$j] = $wild;
                    }
                }
            }
            $this->round->matrix = $matrix;
            $this->round->matrixString = array2d_to_string($matrix);
            $this->round->matrixFlatten = $this->round->generateFlatMatrix($matrix);
        }
    }

    private function handleTreasureChests($details)
    {
        $chestSymbol = $details["chest"]["symbol"];
        if(in_array($chestSymbol, $this->round->matrixFlatten))
        {
            $chest = $this->replaceChestSymbol($details);
            $this->handleTreasureChest($details, $chest["chest"],$chest["index"]);
        }
    }

     private function replaceChestSymbol($details)
    {
        $weights = $details["chest"]["weights"];
        $values = $details["chest"]["values"];
        $symbols = $details["chest"]["symbols"];
        $index = get_weighted_index($weights);
        $chest = $values[$index];
        $symbol = $symbols[$index];
        $chestSymbol = $details["chest"]["symbol"];

        $matrix = $this->round->matrix;
        $j=$this->game->numColumns-1;
        for( ;$j < $this->game->numColumns; $j++)
        {
            for($i=0; $i < $this->game->numRows; $i++)
            {
                if($matrix[$i][$j] == $chestSymbol) {
                    $matrix[$i][$j] = $symbol;
                    $index = $j + ($i * $this->game->numColumns);
                }
            }
        }
        $this->round->matrix = $matrix;
        $this->round->matrixString = array2d_to_string($matrix);
        $this->round->matrixFlatten = $this->round->generateFlatMatrix($matrix);

        if (isset($this->round->freeSpins)) {
            $dtls = $this->round->freeSpins["details"];
            $wldReel = $dtls["pick_details"]["reels"];
            $wlds = $dtls["pick_details"]["wilds"];

            if (in_array($index, $wlds) or 
                in_array($j-1, $wldReel)) {

                $wild = $details["wild_symbol"];
                $temp = array($index => $wild);
                $fMatrix = array_replace($this->round->matrixFlatten, $temp);
                $this->round->matrixFlatten = $fMatrix;
            }
        }
        return array("chest" =>$chest, "index" =>$index);
    }

    private function handleTreasureChest($details, $chest, $indx)
    {
       
        $reward = "multiplier";
        $rwdValue = 0;
        $multiplier = 1;
        if(isset($this->round->freeSpins))
        {
            $weights = $details[$chest]["weights"];
            $values = $details[$chest]["values"];
            $wld = $this->game->wilds[0];
            if (count(array_unique($this->round->matrixFlatten)) === 1 &&
                end($this->round->matrixFlatten) === $wld)
            {
                $weights = $details[$chest]["w_weights"];
                $values = $details[$chest]["w_values"];
            }
            $index = get_weighted_index($weights);
            $value = $values[$index];
            if ($value < 0)
            {
                $features = $details[$chest]["features"];
                $feature = $features[$index];

                if($feature == "freespins")
                {
                    $numSpins = $details["chest"][$feature][$index];
                    $this->updateSpins($numSpins);
                    $rwdValue = $numSpins;
                }
                else if ($feature == "sticky_wilds") {
                    $numWilds = $details[$chest][$feature][$index];
                    $rwdValue = $this->updateWilds($numWilds);
                    $this->round->freeSpins["details"]["pick_details"]["wild_index"] = $rwdValue;
                }
                else if ($feature == "wild_reel")
                {
                    $rwdValue = $this->updateWildReel();
                    $this->round->freeSpins["details"]["pick_details"]["reel_index"] = $rwdValue;
                }
                $reward = $feature;
            }
            else {
                $rwdValue = $this->round->totalBet * $value;
                $multiplier = $value;
                $this->round->winAmount += $rwdValue;
            }
        }
        else {
            $weights = $details[$chest]["weights"];
            $values = $details[$chest]["values"];
            $index = get_weighted_index($weights);
            $value = $values[$index];

            if ($value == "ragnarokFS") {
                $reward = $value;
                $numSpins = $details["chest"]["freespins"][$index];
                $rwdValue = $numSpins;
                $this->awardRagnarokSpins($numSpins, $details, $chest);
            } else if ($value == "rageboost") {
                $reward = $value;
                $rwdValue = $details["chest"]["freespins"][$index];
                $numSpins = $details["chest"]["freespins"][$index-1];
                $this->rageMeters($rwdValue,$numSpins);
            } else if ($value < 0) {
                $numSpins = $details["chest"]["freespins"][$index];
                $scattersCount = $details["chest"]["scaters"][$index];
                $reward = "freespins";
                $rwdValue = $numSpins;
                $this->scattersCount['total'] = $scattersCount;
                $this->bonusGameId = $details["bonus_game_id"];
                $sc = $this->game->scatters[0];
                if (!in_array($sc, $this->round->matrixFlatten) or
                    !in_array(array_count_values(
                    $this->round->matrixFlatten)[$sc],$details["chest"]["scaters"]))
                {
                    parent::checkAndGrantBonusGame("chest");
                }else{
                    parent::checkAndGrantBonusGame("chest","chest");
                }
            } else {
                $rwdValue = $this->round->totalBet * $value;
                $this->round->winAmount += $rwdValue;
                $multiplier = $value;
            }
        }

        $tmp = array("type" => "chest",
                    "color" => $chest,
                    "index" => $indx,
                    "reward" => $reward,
                    "value" => $rwdValue,
                    "multiplier" => $multiplier);
        array_push($this->round->bonusGamesWon, $tmp);
    }

    private function applyFeature($details)
    {
        if (!isset($this->round->freeSpins)) {
            return;
        }
        $dtls = $this->round->freeSpins["details"];
        $Reel = $dtls["pick_details"]["reels"];
        $wlds = $dtls["pick_details"]["wilds"];
        $wild = $details["wild_symbol"];
        $highSym = $details["highpay_symbols"];

        $matrix = $this->round->matrix;

        $randArr = Array();
        for($j=0; $j < $this->game->numColumns; $j++) {
            for($i=0; $i < $this->game->numRows; $i++)
            {
                if(in_array($j, $Reel)) {
                    $matrix[$i][$j] = $wild;
                }
                else if(in_array($j + ($i * $this->game->numColumns), $wlds))
                {
                    $matrix[$i][$j] = $wild;
                }
                else if(isset($dtls["chance"]) && in_array($matrix[$i][$j], $highSym))
                {
                    $sym = $matrix[$i][$j];
                    $chance = $dtls["chance"][$sym];
                    $values = $details["values"];
                    $bool = weighted_random_number($chance, $values);
                    if($bool == "true") {
                        $matrix[$i][$j] = $wild;
                        array_push($randArr, $j + ($i * $this->game->numColumns));
                    }
                }
            }
        }
        $this->round->postMatrixInfo['matrix'] = $matrix;
        $this->round->postMatrixInfo['feature_name'] = "random_symbols";
        $this->round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
        $this->round->postMatrixInfo['matrixFlatten'] = $this->round->generateFlatMatrix($matrix);
        $this->round->postMatrixInfo['wild_symbols'] = $wlds;
        $this->round->postMatrixInfo['expand_positions'] = $dtls["pick_details"]["reel_index"];
        $this->round->postMatrixInfo['random_wild_positions'] = $randArr;

        $this->round->freeSpins["details"]["pick_details"]["wilds"] = 
            array_merge_recursive($this->round->freeSpins["details"]["pick_details"]["wilds"], $randArr);

        $this->updateSpins();
    }

    private function updateWilds($numWilds)
    {
        $wArr = array();
        $wild = $this->game->wilds[0];
        if(in_array($wild, $this->round->matrixFlatten)) {
            $wArr = array_keys($this->round->matrixFlatten,$wild);
        }
        $i=0;
        $tmp = array();
        while ($i < $numWilds)
        {
            $n = $this->game->numRows * $this->game->numColumns;
            $rndx = get_random_number(0,$n-1);
            if(in_array($rndx, $wArr)) { continue;}
            $i++;
            array_push($this->round->freeSpins["details"]["pick_details"]["wilds"],$rndx);
            array_push($tmp, $rndx);
        }
        $this->updateSpins();
        return $tmp;
    }

    private function awardRagnarokSpins($numSpins, $details, $chest) {
        $pickDetails = array("feature" => "ragnarok",
                            "value" => 0,
                            "wilds" => array(),
                            "reels" => array(),
                            "wild_index" => array(),
                            "reel_index" => array(),
                            "type" => "chest");
        $details = array("parent_type" => "normal",
                        "fs_game_id" => $details['fs_game_id'],
                        "chance" => $details['chance'],
                        "num_spins" => $numSpins,
                        "multiplier" =>$details['multiplier'],
                        "pick_details" => $pickDetails);
        award_freespins($this->game->gameId, $this->game->subGameId,
                        $this->accountId, $this->round->roundId,
                        $numSpins, $details['multiplier'],
                        $this->round->coinValue, $this->round->numCoins,
                        $this->round->numBetLines, $this->round->amountType,
                        $round_ids="", $history="", $spin_type=2, $details);
        $freeGame = array('type' => "freespins",
                            "num_spins" => $numSpins,
                            "spins_left" => $numSpins,
                            "parent_type" => "ragnarokFS");
        array_push($this->round->bonusGamesWon, $freeGame);
    }

    protected function updateWildReel()
    {
        $dtls = $this->round->freeSpins["details"];
        $wldReel = $dtls["pick_details"]["reels"];
        $reelNo = get_random_number(0,$this->game->numRows);
        while (count($wldReel) < $this->game->numColumns && in_array($reelNo, $wldReel)) {
            $reelNo = get_random_number(0,$this->game->numRows);
        }
        if (count($wldReel) < $this->game->numColumns) {
            array_push(
                $this->round->freeSpins["details"]["pick_details"]["reels"], $reelNo);
        }
        $this->updateSpins();
        return $reelNo;
    }

    public function rageMeters($boost, $numSpins)
    {
        $meters = $this->game->misc["rage_meter"]["meters"];

        for ($i=0; $i < count($meters); $i++)
        {
            $this->rageMeter($boost, $meters[$i], $numSpins);
        }
    }

    private function updateSpins($numSpins = 0)
    {
        $this->updateFreeSpins(
            $this->round->freeSpins['id'],
            $this->game->gameId, $this->accountId,
            $this->round->freeSpins['base_round_id'],
            $numSpins, $this->round->freeSpins['multiplier'],
            $this->round->amountType,
            $this->round->freeSpins['round_ids'],
            $this->round->freeSpins['history'],
            $this->round->freeSpins['details']
        );
    }

    protected function rageMeter($mValue, $mName, $numSpins)
    {
        $misc = $this->round->previousRound['misc'];
        $coinValue = $this->round->coinValue;
        if(isset($misc['rage_meter']))
        {
            $details = $misc['rage_meter'][$mName];
            $maxValue = $misc['rage_meter']["max"];
            $coinValue = $details["coin_value"];
            $coinValue += $mValue * $this->round->coinValue;
            $mValue = $details['value']+$mValue;

            if ($mValue >= $maxValue)
            {
                $mValue = $mValue - $maxValue;
                $exededValue = $mValue * $this->round->coinValue;
                $coinValue -= $exededValue;
                $fsCoinValue = $coinValue/$maxValue;
                $coinValue = $exededValue;

                $multiplier = 1;
                $pickDetails = array("feature" => "freespins",
                             "value" => $numSpins,
                             "wilds" => array(),
                             "reels" => array(),
                            "wild_index" => array(),
                            "reel_index" => array(),
                            "type" => "rage_meter");
                $details = Array(
                            'parent_type' => "meter_".$mName,
                            'fs_game_id' => $this->game->numRows,
                            "meter" => $mName,
                            'num_picks' => 0,
                            'num_prizes' => $this->game->numColumns,
                            'base_coin_value' => $this->round->coinValue,
                            'chance' => $this->game->misc["chance"][$mName],
                            'sticky_symbol' => $mName,
                            'num_spins' => $numSpins,
                            'multiplier' => $multiplier,
                            'pick_details'=>  $pickDetails);

                award_freespins($this->game->gameId,
                        $this->game->subGameId, $this->accountId,
                        $this->round->roundId, $numSpins, $multiplier,
                        $fsCoinValue, $this->round->numCoins,
                        $this->round->numBetLines, $this->round->amountType,
                        $round_ids="", $history="", $spin_type=2, $details);

                $freeGame = array('type' => "freespins",
                                    "num_spins" => $numSpins,
                                    "spins_left" => $numSpins,
                                    "parent_type" => "meter_".$mName,
                                    "coin_value" => round_half($fsCoinValue));
                array_push($this->round->bonusGamesWon, $freeGame);
            }
        }
        $this->round->previousRound['misc']['rage_meter'][$mName]["value"] = $mValue;
        $this->round->previousRound['misc']['rage_meter'][$mName]["coin_value"] = $coinValue;
        $this->round->previousRound['misc']['rage_meter']["base_coin_value"] = $this->round->coinValue;
    }
    public function awardBonusGame()
    {
        $temp = $this->round->queuedBonusGames[0];
        grant_bonus_game($temp['game_id'], $temp['sub_game_id'],
                $temp['base_round_id'], $temp['round_id'],
                $temp['account_id'], $temp['bonus_game_id'],
                $temp['bonus_game_code'], $temp['num_picks'],
                $temp['game_data'], $temp['multiplier'],
                $temp['amount_type'], $temp['coin_value'],
                $temp['num_coins'], $temp['num_betlines']);
        update_queued_bonus($temp['id'], $this->round->amountType);
        $this->round->nextRound = array('type' => 'bonus_game',
                            'bonus_game_id' => $temp['bonus_game_id'],
                            'num_picks' => $temp['num_picks'],
                            'num_prizes' => $this->game->numColumns,
                            'parent_type' => "chest"
                        );
    }
    protected function meters()
    {
        $temp = array("type"=>"rage_meter",
            "meter_a" =>$this->round->previousRound['misc']["rage_meter"]["a"]["value"],
            "meter_b" =>$this->round->previousRound['misc']["rage_meter"]["b"]["value"],
            "meter_c" =>$this->round->previousRound['misc']["rage_meter"]["c"]["value"],
            "meter_d" =>$this->round->previousRound['misc']["rage_meter"]["d"]["value"],
            "base_coin_value" =>$this->round->previousRound['misc']["rage_meter"]["base_coin_value"]
        );
        array_push($this->round->bonusGamesWon, $temp);
    }
}
?>
