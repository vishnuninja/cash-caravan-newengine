<?php
require_once 'ibonus.inc.php';
require_once 'bonus_picks.inc.php';
class NacroPollsBonus extends BonusPickGame implements iBonus {
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;
    protected $multiplier;
    protected $bonus_win;
    protected $jackpotWin;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount) {
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->game = $game;
        $this->round = $round;
        $this->accountId = $accountId;
        $this->scattersCount = $scattersCount;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $this->multiplier = 0;
        $this->bonus_win = array();
        $this->jackpotWin = array();
    }

    public function checkAndGrantBonusGame() {
        $spinType = $this->round->spinType;
        $config = $this->getBonusConfig( $spinType);
          $config = decode_object($config);
          $levelTrigger = 1;
          $state = 0;
          for ($i=0; $i < 10 ; $i++) {
              $level1 = $config['levels'][$i+1];
              $lev = array();
              for ($k=0; $k < count($level1); $k++) {
                  if ($level1[$k]['weigth'] == 1){
                      array_push($lev, $level1[$k]);
                  }
                  elseif($level1[$k]['weigth'] >= 2){
                      for ($j=0; $j < $level1[$k]['weigth']; $j++) {
                          array_push($lev, $level1[$k]);
                      }
                  }
              }
              shuffle($lev);
              $levelTrigger+=1;
              $state = $this->generateWinData($lev,$levelTrigger);
              if($state == 1){
                  break;
              }
          }
          array_push($this->round->miscPrizes,$this->jackpotWin[0]);
   
//   print_r($this->jackpotWin);
          $baseRoundId = $this->round->roundId;
  
          $deatils = Array("bonus_win" => $this->jackpotWin,"level"=>1,"count"=>0,"total_win" =>0);
  
          $bonusGameData = encode_objects($deatils);
  
          grant_bonus_game($this->game->gameId, $this->game->subGameId,
  
                              $baseRoundId, $this->round->roundId,
  
                              $this->accountId, $this->bonusGameId,
  
                              $config['code'], count($this ->bonus_win), $bonusGameData,
  
                              $this ->multiplier, $this->round->amountType,
  
                              $this->round->coinValue, $this->round->numCoins,
  
                              $this->round->numBetLines);
        $bonusGameWon = Array(
            'type'          => 'bonus_game',
            'bonus_game_id' => $this->bonusGameId,
            'num_picks'     => 60,  
            'num_prizes'    => 60
            ); 
            array_push($this->round->bonusGamesWon, $bonusGameWon);
    
    }

    public function loadBonusGame() {
        $gameData = decode_object($this->round->bonusGames['game_data']);
        $this->round->nextRound = Array(

            // $this->round->bonusGameRound = Array(
                'type'          => 'bonus_game',
                'bonus_game_id' => $this->round->bonusGames['bonus_game_id'],
                'prize_value'   => 0,
                'picked_position'     => $this->round->bonusGames["picks_data"],
                'fs_multiplier' => $gameData["total_win"],
                'state'         => 0,
                'left_data'         => $gameData["bonus_win"]["level".$gameData["level"]]["left"],
                'total_win'         => $gameData["total_win"],
                'current_level'         => $gameData["level"],
                'total_fs_win' => 0,
            // );

            // 'type'          => 'bonus_game',
            // 'num_picks'     => $this->round->bonusGames['game_data']['num_picks'],
            // 'num_prizes'    => count($this->round->bonusGames['game_data']['prizes']),
            // 'pick_positions'=> $this->round->bonusGames['picks_data'],
	        // 'num_freespins' => $this->round->bonusGames['game_data']['num_spins'],
            // 'jackpotPool'   => $this->round->bonusGames['game_data']['jackpotPool']
        );
    }


    public function playBonusGame($pickedPosition)
    {
        $prizeValue = 0;
        $spinType = $this->round->spinType;
        $config = $this->getBonusConfig($spinType);
        $config = decode_object($config);
        $gameData = $this->round->bonusGames['game_data'];
        $left_data = array();
        $gameData = decode_object($gameData);
        $bonus_win = $gameData['bonus_win'];
        $currentLevel = $gameData["level"];
        $soldierIndex = $gameData['bonus_win']["level".$currentLevel][0];
        $soliderValue = $gameData['bonus_win']["level".$currentLevel]["left"][$soldierIndex];
        $soliderPosition = ($currentLevel - 1) * 6 + $pickedPosition;
        $pop_ele = array_shift($gameData['bonus_win']["level".$currentLevel]["left"]);
        array_push($gameData['bonus_win']["level".$currentLevel]["reveled"] ,$pop_ele);
        if(strlen($pop_ele)  > 4){
            $left_data = $gameData['bonus_win']["level".$currentLevel]["left"];
            $count = strlen($pop_ele);
            $gameData["total_win"] += number_format(floatval(substr($pop_ele,5,$count)), 2, '.', '');
            
            $currentLevel += 1;
        }
        
        $this->round->bonusGames['num_user_picks']+=1;
        array_push($this->round->bonusGames['picks_data'], $soliderPosition);
        $state = 0;
        if($pop_ele == "exit"){
            $prizeValue = to_base_currency($this->round->bonusGames['multiplier']* $this->round->totalBet);
            $state = 1;
            $this->round->winAmount = $this->round->bonusGames['multiplier']* $this->round->totalBet;
            $left_data = $gameData['bonus_win']["level".$currentLevel]["left"];
            
        }
        $bonus_win = $gameData['bonus_win'];
        $soldierIndex = intval($soldierIndex);
        $soldierIndex+=1;
        if($soliderValue != "exit" && strlen($pop_ele) <4){
            // $pop_ele = $pop_ele* $this->round->totalBet;
            $gameData["total_win"] +=  $pop_ele;
        }
        
        $gameData['bonus_win']["level".$currentLevel]["count"] =$soldierIndex;
        $gameData["level"] = $currentLevel;
        
        update_bonus_game($this->round->bonusGames['picks_data'],
                        $this->round->bonusGames['num_user_picks'],
                        $gameData, $this->multiplier, $state,
                        $this->round->bonusGames['round_id'],
                        $this->round->bonusGames['game_id'],
                        $this->accountId,
                        $this->round->bonusGames['id'], $this->round->amountType);
        $this->round->bonusGameRound = Array(
            'prize_value'   => $pop_ele,
            'picked_position'     => $soliderPosition,
            'fs_multiplier' => (float)number_format(floatval($gameData["total_win"]),2),
            'state'         => $state,
            'left_data'         => $left_data,
            'level'=> $currentLevel,
            'total_win'         => (float)number_format(floatval($gameData["total_win"]),2),
            'total_fs_win' => $prizeValue,
        );
    }


    private function getBonusConfig($spinType) {
        global $db;
        $table = "game.bonus_config";
        $query = <<<QUERY
                SELECT configuration
                FROM $table
                WHERE bonus_game_id = {$this->bonusGameId} AND
                 spin_type = "{$spinType}"
                QUERY;
        
        $rs = $db->runQuery($query) or ErrorHandler::handleError(1, "BONUSPICKS_001");
        if($db->numRows($rs) == 0) {
            return Null;
        }
        $row = $db->fetchRow($rs);
        return $row[0]; 
    }

    public function generateWinData($level1,$levelnum){
        $state = 0;
        // array_push($this->jackpotWin,array("level".$levelnum-1=>array("left" => [],"reveled" => [])));
        $pure_data = [];
        foreach ($level1 as $key => $val) {
            $key = array_key_first($val);
            $value = $val[$key];
            if($key != "weigth"){   
                //Level2
                $str_pop = strpos($key,"Level");
                if($str_pop === false && $key != "exit"){
                    array_push($pure_data,to_base_currency($value* $this->round->totalBet));
                }
                elseif($str_pop !== false) {
                    array_push($pure_data,"Level".to_base_currency($value* $this->round->totalBet));
                }
                elseif ($key == "exit"){
                    array_push($pure_data,$key);
                }
            }
        }
        $this->jackpotWin["level".($levelnum-1)] = array("left" => $pure_data,"reveled" => [],"count"=>0);
        foreach ($level1 as $key => $val) {
            $key = array_key_first($val);
            $value = $val[$key];
            if($key != "weigth"){
                array_push($this ->bonus_win, $val);
                $str_pop = strpos($key,"Level");
                $this->multiplier += $value;
                if($str_pop !== false) {
                    return $state;
                }
                elseif ($key == "exit"){
                    $state = 1; 
                    return $state;
                }
            }
        }
        return $state;
    }

    // protected function isConfigValid($config) {
    //     if(empty($config) or $config == Null or !$config) {
    //         return false;
    //     }
    //     return true;
    // }



}

?>













