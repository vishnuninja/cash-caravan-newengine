<?php
class ExtraFgSpin
{
    var $game, $round;
    public function __construct(&$game, &$round)
    {
        $this->game = $game;
        $this->round = $round;
    }

    public static function handleFgSpin(&$game, &$round)
    {
        $fgspinHandler = new ExtraFgSpin($game, $round);
        $fgspinHandler->assignFg();
    }
    
    private function assignFg()
    {
        $this->round->resetRound();
        // $this->round->reelPointers = [67,65,30,24,26,22];
        $this->round->generateReelPointers();
        $this->round->generateMatrix();
        $this->getScatterMatrix();
		$scatterMultiplier = $this->getScatterMultiplier();
        $baseBet = $this->changeBet();
        $this->round->scatterWin =  $scatterMultiplier*$baseBet;
		$this->round->winAmount += $scatterMultiplier*$baseBet;
        $this->round->handleFreeSpins();
        }

        private function getScatterMatrix(){
            global $game_handlers;

            $featureConfig = $this->game->bonusConfig;

            if (
                !$featureConfig or !isset($featureConfig['scatter_weight']) or
                !isset($featureConfig['scatter_weight'][$this->round->spinType])
            ) {
                return;
            }
            $postMatrixFeatures = $featureConfig['scatter_weight'][$this->round->spinType];
            foreach ($postMatrixFeatures as $index => $feature) {
                // echo $featureName;
                $featureName = $feature['feature'];
                $details = $feature['details'];
            // echo $featureName;
                # todo added here for review
                if (isset($feature['bonus_game_id']) && $feature['bonus_game_id'] > 0) {
                    $bonusGameId = $feature['bonus_game_id'];
                    $this->featureData = $feature;
                    $factoryObject = new BonusFactory($this->game, $this);
                    $bonusObject = $factoryObject->getObjectFromId($bonusGameId);
                    if ($bonusObject != null and !empty($bonusObject)) {
                        $bonusObject->checkAndGrantBonusGame();
                    }
                } else {
                    # todo added here for review
                    if( isset($game_handlers[$featureName]) ){
                        $handler = $game_handlers[$featureName] ;
                        $handler($this->round, $details);
                    }
                }
            }
        $this->scatter_sym($this->round, $details);
            // global $sctterIndex;
        //     if (
        //         !$featureConfig or !isset($featureConfig['scatter_weight']) or
        //         !isset($featureConfig['scatter_weight'][$this->round->spinType])
        //     ) {
        //         return false;
        //     }
        //     $details = $featureConfig['scatter_weight'][$this->round->spinType][0]["details"];
        //     $scatter_appeared =  $this->round->getMultiplierValue($details["weight"], $details["scatter_weight"]);
        // // echo $scatter_appeared;
        // $this->round->postMatrixInfo["count"] = $scatter_appeared;
        //     for ($i=0; $i < $scatter_appeared; $i++) { 

        //         $random_row  = rand(0,$this->game->numRows-1);
        //         $this->round->matrix[$random_row][$i] = "s";
        //     }
        //     $this->round->matrixString = array2d_to_string($this->round->matrix);
		//     $this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);
        }
    
        private function scatter_sym($round, $details){
            // $details = $featureConfig['scatter_weight'][$this->round->spinType][0]["details"];
            $scatter_appeared =  $this->round->getMultiplierValue($details["weight"], $details["scatter_weight"]);
        // echo $scatter_appeared;
        $this->round->postMatrixInfo["count"] = $scatter_appeared;
        if(isset($details["reel_config"])){

            $reel_num = [];
            while (count($reel_num) < $scatter_appeared) {
                $reel_position = $round->getMultiplierValue($details["reel_config"]["total_weight"], $details["reel_config"]["symbiol_weight"]);
                if (!in_array($reel_position - 1, $reel_num)) {
                  array_push($reel_num, $reel_position - 1);
                }
              }
              for ($i = 0; $i < count($reel_num); $i++) {
                $random = rand(0, $round->game->numRows - 1);
                $round->matrix[$random][$reel_num[$i]] = "s";
            
            }
        }
        else{

            for ($i=0; $i < $scatter_appeared; $i++) { 
                $random_row  = rand(0,$this->game->numRows-1);
                $this->round->matrix[$random_row][$i] = "s";
            }
        }
            $this->round->matrixString = array2d_to_string($this->round->matrix);
		    $this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);
        }

        public function getScatterMultiplier()
        {
            $mul = 0;
            $scattersCount = 0;
            $symbol = "";
            if ($this->round->spinType == "normal") {
                foreach ($this->game->scatters as $ind => $scatter) {
                    $symbol = $scatter;
                    $count = get_element_count($this->round->matrixFlatten, $scatter);
                    // $scattersCount[$scatter] = $count;
                    $scattersCount += $count;
                }
                $win_details  = $this->game->payTable[$scatter];
                foreach ($win_details as $key => $value) {
                    if($key  <= $scattersCount ){
                        $mul = $value;
                        return $mul;
                    }
                }
            }
            return $mul;
        }

        private function changeBet(){
            $featureConfig = $this->game->symbolConfig;
            if (	
                !$featureConfig or !isset($featureConfig['BuyFg']) or
                !isset($featureConfig['BuyFg'][$this->round->spinType])
                ) {
                return $this->round->totalBet;
            }

            $buy_fg_bet = $featureConfig['BuyFg'][$this->round->spinType]["buy_fg"]; // 1.4
            $baseBet = $this->round->totalBet / $buy_fg_bet[0];
            return $baseBet;
            }
    }



?>
