<?php
require_once 'ibonus.inc.php';

// To handle avalanche feature of "The DarkArt"

class Avalanche extends BonusPickGame
{
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;
    protected $avalancheCount;
    protected $avalancheDetails;
    protected $avalancheWinAmount;
    protected $scatterWin;
    protected $scatterFs;
    protected $gameWilds;
    protected $secBreathFlag;
    protected $strikeFlag;
    protected $strikeDetails;
    protected $playerBalance; 
    protected $spinScreenWin;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount)
    {
        $this->game = $game;
        $this->round = &$round;
        $this->accountId = $accountId;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->scattersCount = $scattersCount;
        $this->avalancheCount = 0;
        $this->avalancheDetails = array();
        $this->avalancheWinAmount = 0;
        $this->scatterWin = array();
        $this->scatterFs  = array();
        $this->gameWilds  = $game->wilds;
        $this->secBreathFlag = false;
        $this->strikeFlag = false;
        $this->strikeDetails = false;
        $this->playerBalance = 0;
        $this->spinScreenWin = 0;
    }

    // Called from handlePostWinCalculations() of spin_handler.
    public function checkAndGrantBonusGame()
    {  
        $bonus = $this->game->bonusConfig;
        $config = array();
        $multiplier = 1; // initialize multiplier.
        $determination = false;
        $this->spinScreenWin = 0;

        if( isset($bonus['bonus_config'][$this->round->spinType])
            && count($bonus['bonus_config'][$this->round->spinType]) > 0 ) {
            $config = $bonus['bonus_config'][$this->round->spinType];
            $screen_win = $this->awardScatterWin($config);
        }
    
        // Need to set "matrix" key of "current_round" key in client response
        // as the first matrix generated in a spin.
        // To start avalanche win needed from payline wins not scatter screen win.
        // Check this
        if ( $this->round->winAmount <= $this->avalancheWinAmount 
                && $this->spinScreenWin == 0 ) {

            // For client communication.
            if( count($this->avalancheDetails) > 0 ) {
                $this->round->matrixString = $this->avalancheDetails[0]['pre_aval_matrixstr'];
            }

            // Before leaving avalanche check and play check and award freespins.
            if( count($config) > 0 ) {
                $this->awardFreespins($config);
            }

            // For client communication.
            $this->round->otherWins['cluster_wins'] = $this->avalancheDetails;

            // For client communication.
            if($this->round->spinType == 'freespin' &&
                $this->round->freeSpins['spins_left'] == 1) {

                $this->round->freespinState = 1;
            }

            return; 
        }

        $this->avalancheCount++;
        $prev_round_matrixstr   = $this->round->matrixString;
        $prev_round_paylinewins = $this->round->paylineWins;

        // $prev_win_pos used only for client comm.
        list($bursted_raw_matrix, $prev_win_line, $prev_win_pos) = 
            $this->getBurstedRawMatrix();

        $sticky_sym_matrix  = $this->getStickySymMatrix($bursted_raw_matrix);
        $moved_index        = $this->getmovedIndex($bursted_raw_matrix);
    
        list($moved_index, $prev_win_pos)        = 
                $this->getStrikeChange($this->strikeDetails, $moved_index, $prev_win_pos); 


        $prev_reel_pointers = $this->round->reelPointers;
        $prev_win           = $this->round->winAmount - $this->avalancheWinAmount;
		$multiplier 		= $this->getAvlMult();

        // win amount calculated in avalanche count 1 is multiplied 
        // with multiplier 2 below  when avalanche count is 2
        // from this round of avalance big symbols will be used as wild.
        // After multiplication, win calulation is done for 2nd avalanche round.
        // 1st avalanche round's win calculation
        
		if($this->avalancheCount == $bonus['level_two']) { // avalancheCount = 2 
            $this->round->winAmount   += ($multiplier-1)*$prev_win; 
            $prev_win *= $multiplier;
            $determination = true;
            $this->setDetermination(); // this will be used in next win calculation.
        }

        // win amount calculated in avalanche count 2 is multiplied 
        // with multiplier 2 below  when avalanche count is 3
        // After multiplication, win calulation is done for 3rd avalanche round.
        // 2nd avalanche round's win calculation
        
		if($this->avalancheCount == $bonus['level_three']) { // avalancheCount = 3
            $this->round->winAmount   += ($multiplier-1) * $prev_win;
            $prev_win *= $multiplier;
        }

        // win amount calculated in avalanche count 3 is multiplied 
        // with multiplier 3 below  when avalanche count is 4
        // After multiplication win calulation is done for 4th avalanche round.
        // 3rd avalanche round's win calculation
        
		if($this->avalancheCount == $bonus['level_four']) { // avalancheCount = 4
            $this->round->winAmount   += ($multiplier-1)*$prev_win;
            $prev_win *= $multiplier;
        }

        // 4th avalanche round's win calculation by applying multiplier.
		if($this->avalancheCount == $bonus['level_five']) { // avalancheCount = 5
            $this->round->winAmount   += ($multiplier-1) * $prev_win;
            $prev_win *= $multiplier;
        }

        // 5th and above avalanche round's win calculation by applying multiplier.
        
		if($this->avalancheCount >= $bonus['level_six']) { // avalancheCount = 6
            $this->round->winAmount   += ($multiplier-1) * $prev_win;
            $prev_win *= $multiplier;
        }

        $this->round->winAmount += $this->spinScreenWin;
        $prev_win += $this->spinScreenWin;

        // This assignment is must before new win calculation. ****
        $this->avalancheWinAmount = $this->round->winAmount;
        $wild_resp = $this->game->wilds; 	// client communication.
        $this->resetRound();            	// *** Notice this reset.
        $this->round->reelPointers = $this->generateReelPointers($sticky_sym_matrix, $prev_reel_pointers);
        
        // matrixFlatten will be generated below on which win will be calculated.
        $busted_info = $this->genStickyElementMatrix($sticky_sym_matrix);
        $this->round->handlePostMatrixFeatures();
        $this->round->generateBetLines();
        $this->round->calculatePaylineWins();

        // Due to avalanche symbols on the matrix have been moved.
        // On moved index new symbol will come. These new symbols will be
        // fetched from new matrix
        $moved_sym = $this->getMovedSym($moved_index);

        $sec_breath   = $this->checkSecBreath($prev_win) ;
        $light_strike_prev   = $this->strikeDetails;
        // In current round's $loop light_strike_prev will be returned to client.
        // Below strike detail will be returned to client in next loop's round
        $this->strikeDetails = $this->checkLightningStrike(); 

        
        $curr_round_matrixstr   = $this->round->matrixString;

        if($this->avalancheCount == $bonus['level_one']) {
            // TODO TODO *** Check below statement in live env. Is subtracting total bet is needed ???
            if($this->round->spinType == 'normal') {
                //$this->playerBalance = $this->round->player->balance  + to_base_currency($prev_win) - to_base_currency($this->round->totalBet);
				$this->playerBalance = $this->round->player->balance  + to_base_currency($prev_win);
            }
            else {
                $this->playerBalance = $this->round->player->balance  + to_base_currency($prev_win);
            }
        }
        else {
            $this->playerBalance += to_base_currency($prev_win);
        }

        $round_screen_win = isset( $this->scatterWin[$this->avalancheCount - 1] ) ?
            $this->scatterWin[$this->avalancheCount - 1] : null;

        $round_to_client = array(
            'pre_aval_matrixstr'    => $prev_round_matrixstr,
            'paylinewins'           => $prev_round_paylinewins,
            'multiplier'            => $multiplier,
            'win_amount'            => $prev_win,
            'player_balance'        => $this->playerBalance,
            'post_aval_matrixstr'   => $curr_round_matrixstr,
            'busted_matrix'         => $sticky_sym_matrix,
            'busted_index'          => $moved_index, //All index either busted or whose sym moved due to busted sym.
            'new_symbols'           => $moved_sym,   //All new symbols on above indices. 
            'prev_won_paylines'     => $prev_win_line,
            'prev_won_pos'          => $prev_win_pos,
            'determination'         => $determination,
            'wilds'                 => $wild_resp,
            'second_breath'         => $sec_breath,
            'light_strike'          => $light_strike_prev,
            'screen_wins'	    => $round_screen_win,
        );


        array_push($this->avalancheDetails, $round_to_client); 

        $this->checkAndGrantBonusGame();

        return ;        
    }
	
	public function getAvlMult() {
		$bonus 			= $this->game->bonusConfig;
		$mul_index 		= $this->avalancheCount - 1;
		$max_mult_level = $bonus['max_mult_level']; 
		
		
		if( $this->avalancheCount > $max_mult_level ) {
			$mult = $bonus['avl_multipliers'][$max_mult_level];
		}
		else {
			$mult	= $bonus['avl_multipliers'][$mul_index];
		}
			
		return $mult;		
	}

    /*
     * @fun getFSSubGameId
     * To fetch sub_game_id to be used in freespins in Variable RTP games.
     * */
    public function getFSSubGameId() {
	    $fs_game_id = '';

	    if( isset($this->game->misc['sub_games_config'])
		    && $this->game->misc['sub_games_config'] != '') {

		    $sub_games_config = $this->game->misc['sub_games_config'];

            // To handle default sub game id in base and free spin.
            if($this->round->rtpSubGameId == '') {
                $this->round->rtpSubGameId = $sub_games_config[0]["main_sub_game_id"];
            }


		    for($i = 0; $i < count($sub_games_config); $i++) {
			    if($sub_games_config[$i]["main_sub_game_id"] == $this->round->rtpSubGameId) {
				    $fs_game_id = $sub_games_config[$i]["fs_sub_game_ids"][0];
			    }
		    }
	    }

	    if($fs_game_id == '') {
		    ErrorHandler::handleError(1, "FSSUB_GAME_ID 1");
	    }


	    return $fs_game_id;
    }


    /**
    * @fun getStrikeChange only for client communication.
    */
    public function getStrikeChange($light_strike, $moved_index, $prev_win_pos) { 
        if( !is_array($light_strike) ) {

            return array($moved_index, $prev_win_pos);
        }

        $payline_wins = $light_strike['payline_win']['details'];
        $pos = array();

        if( isset($payline_wins) && ($payline_wins != '') ) { 

            $win_array = explode(';',$payline_wins); 
            foreach($win_array as $val) {
                $valArray = explode(':',$val);
                $mat_pos  = $valArray[5]; 
                $mat_pos  = explode(',', $mat_pos);
                $pos      = array_merge($pos, $mat_pos) ;
            }
            $pos = array_unique($pos);
            $pos = array_values($pos);
        }

        $strike_busted_mat = array();
        if( count($pos) > 0 ) {

            for($i = 0; $i < $this->game->numRows; $i++)
            {
                for($j = 0; $j < $this->game->numColumns; $j++)
                {
                    $strike_busted_mat[$i][$j]=1;
                }
            }

            for($j = 0; $j < count($pos); $j++) {
                $row = $pos[$j] / $this->game->numColumns;
                $col = $pos[$j] % $this->game->numColumns;
                $strike_busted_mat[$row][$col]=0;
            }

            $st_moved_ind = $this->getmovedIndex($strike_busted_mat);

            if( count($st_moved_ind) > 0 ) {
                $moved_index = array_merge($moved_index, $st_moved_ind);
                $moved_index = array_unique($moved_index);
                $moved_index = array_values($moved_index);     
            }

            $prev_win_pos = array_merge($pos, $prev_win_pos);
        }        

        return array($moved_index, $prev_win_pos);
    }

    public function handleSymStrike($dummy_sym) {
        $bonus = $this->game->bonusConfig;
        $big_sym = $bonus['big_sym'];

        for($i = 0; $i < count($this->round->matrix); $i++) {
            for($j = 0; $j < count($this->round->matrix[$i]); $j++) {
                if( in_array( $this->round->matrix[$i][$j],  $big_sym )
                    || in_array( $this->round->matrix[$i][$j],  $this->game->scatters )
                    || in_array( $this->round->matrix[$i][$j],  $this->game->wilds ) ) {
                    $this->round->matrix[$i][$j] = $dummy_sym;
                }
            }
        }
    }

    /**
     * @fun getOneSymWin
     * To ensure that there should be only one symbol used in strike ways win
     * */
    public function getOneSymWin($pre_strike_win) {
        $details		= $this->round->paylineWins['details'];

        if( $details == '' ) {
            return false;
        }

        $details_arr 	= explode(';',$details);
        $sym_details 	= array();

        if( count($details_arr) <= 1 ) {
            return false;
        }

        foreach($details_arr as $val) {
            $valArray = explode(':',$val);
            $num_repeats	= $valArray[3];
            $won_str		= $valArray[4];

            for($i = 0; $i < $num_repeats; $i++) {
                $temp_sym = $won_str[$i];

                if(in_array($won_str[$i], $this->game->wilds)) {
                    continue;
                }

                break;
            }

            if( !isset($sym_details[$temp_sym]) ){
                $sym_details[$temp_sym] = array();
            }
            $sym_details[$temp_sym][] = $val;
        }

        if( count($sym_details) <= 1 ) {
            return false;
        }

        $win_amount = 0;
        if( count($sym_details) > 1) {
            foreach($sym_details as $key => $val) {
                $pay_str = implode(';', $val);
                $win_amount = 0;

                for($j = 0; $j < count($val); $j++) {
                    $val_arr = explode(':', $val[$j]);
                    $win_amount += $val_arr[1];
                }

                break;
            }
        }

        $this->round->paylineWins['details'] = $pay_str;
        $this->round->winAmount = $pre_strike_win + $win_amount;
    }

    /*
    * FlattenMatrix is used to prepare betlines for defined betlines
    * i.e. in Default betlines class.
    * matrix is used to prepare betlines in ways games.
    * Scatter feature triggered, no line win. In this case no strike.
    */
    public function checkLightningStrike() { 
        $numScatters 	= $this->getScattersCount();
		$bonus			= $this->game->bonusConfig;
		$min_count		= $bonus['bonus_config']['normal']['details']['min_count'];

        if( ( ($this->round->winAmount <= $this->avalancheWinAmount) && ($numScatters < $min_count) )
            || $this->strikeFlag
            || $this->avalancheCount < $bonus['level_six'] ) {

            return false;
        }       

        if( $this->round->winAmount > $this->avalancheWinAmount && ($numScatters >= $min_count) ) {
            return false;
        }
		
		if( ($this->round->winAmount > $this->avalancheWinAmount) && ($numScatters < $min_count) ) {
            // Lightning strike possible only if win from one payline and no scatter feature **
        }
		else {
			return false;
		}
        
        global $paylines_config;

        $won_positions  = array(); 
        $sym_on_pos     = array(); 
        $won_sym        = array();
        $dummy_sym      = "0";
        $payLinesWinDetails = $this->round->paylineWins['details'];
        $payLinesWinNormal  = $this->round->paylineWins;
        $numbetlines_main  = $this->round->numBetLines;
        $win_comb_count = 0;

        if( isset($payLinesWinDetails) && ($payLinesWinDetails != '') ) {
            $payLinesWinDetailsArray = explode(';',$payLinesWinDetails);        

            foreach($payLinesWinDetailsArray as $val) {
                $win_comb_count++;
                $valArray = explode(':',$val);

                $num_repeats    = $valArray[3];
                $won_str        = $valArray[4];
                $mat_pos        = $valArray[5];
                $temp_sym       = array();                

                for($i = 0; $i < $num_repeats; $i++) {                  

                    if(in_array($won_str[$i], $this->game->wilds)) {
                        continue;
                    }

                    array_push($won_sym, $won_str[$i]); 
                    break;
                }

                for($i = 0; $i < $num_repeats; $i++) {
                    $temp_sym[] = $won_str[$i];
                }

                $won_positions = array_merge( $won_positions, explode(',',$valArray[5]) );
                $sym_on_pos    = array_merge( $sym_on_pos, $temp_sym );                
            }
        }

        $won_sym = array_unique($won_sym);
        $won_sym = array_values($won_sym);

        // If payline win is for more than one type of symbols,
        // Lightning strike will not be awarded. Win should be on only one payline
        if( count($won_sym) > 1 || ($win_comb_count != 1) ) {
            return false;
        }

        $this->strikeFlag = true;
        $mat_before_ways = $this->round->matrix;

        // feature: Affected reels only will participate in ways win calculation
        // So replace other reels by dummy symbol so that they will not be considered in 
        // win calculation.
        for($m = $num_repeats; $m < $this->game->numColumns; $m++) {
            for($n = 0; $n < $this->game->numRows; $n++) {
                $this->round->matrix[$n][$m] = $dummy_sym;
            }
        }

        // feature: Winning symbols will not participate in ways win calculation
        // So replace them by dummy symbol.
        for($m = 0; $m < count($won_positions); $m++) {         
            $row = $won_positions[$m] / $this->game->numColumns;
            $col = $won_positions[$m] % $this->game->numColumns;
            $this->round->matrix[$row][$col] = $dummy_sym;
        }

        // feature: wild, bonus and big symbols will not participate 
        // in ways win calculation.
        $this->handleSymStrike($dummy_sym);

        $win_before_strike = $this->round->winAmount;
        $this->reSetForStrike();  // TODO review this **      
        $payline_obj = new WaysBetlines($this->game, $this->round);
        $payline_obj->generateBetLines();       
        $this->round->calculatePaylineWins(); 

        // After calculating ways win in strike remove the dummy symbols and 
        // place there original symbols
        for($i = 0; $i < count($this->round->matrix); $i++) {
            for($j = 0; $j < count($this->round->matrix[$i]); $j++) {
                if($this->round->matrix[$i][$j] == $dummy_sym) {
                    $this->round->matrix[$i][$j] = $mat_before_ways[$i][$j];
                }
            }
        }

        $this->getOneSymWin($win_before_strike);
    
        $win_in_strike      = $this->round->winAmount - $win_before_strike;
        $win_in_strike      = $this->collectStrikeWin($win_in_strike);
        $payLinesWinStrike  = $this->round->paylineWins;
        list($strike_won_pos, $won_sym_strike) = $this->getPaylineWins();

        // After ways win cal use original num of betlines **
        // and set won paylines of main game.
        $this->round->paylineWins = $payLinesWinNormal; 
        $this->round->numBetLines = $numbetlines_main;

        return array(
            'lightning'     => true,
            'lightning_win' => $win_in_strike, 					// win amount in strike.
            'payline_win'   => $payLinesWinStrike, 				// win details of strike.
            'won_symbol_normal'    => implode(',',$won_sym), 	// won sym in normal spin not in strike
            'won_pos_normal' => implode(',', $won_positions), 	// won pos in normal spin not in strike
            'strike_won_pos' => $strike_won_pos,
            'won_symbol_strike'    => implode(',',$won_sym_strike),
        );
    }

    public function collectStrikeWin($core_win) {
        $multiplier = $this->getRoundMult();

        return $core_win * $multiplier;
    }
	
	public function getRoundMult() {
		$bonus		= $this->game->bonusConfig;  
        $multiplier = 1;
		$avl_count  = $this->avalancheCount;
		
		if($avl_count >= $bonus['level_five']) {
			$mult_index = $bonus['level_five'];
			$multiplier = $bonus['avl_multipliers'][$mult_index];			
		}
		else {
			$mult_index = $avl_count;
			$multiplier = $bonus['avl_multipliers'][$mult_index];
		}

        return $multiplier;
    }

    public function getPaylineWins() {
        $payLinesWinDetails = $this->round->paylineWins['details'];
        $won_positions = array();
        $sym_on_pos = array();
        $won_sym    = array();

        if( isset($payLinesWinDetails) && ($payLinesWinDetails != '') ) {
            $payLinesWinDetailsArray = explode(';',$payLinesWinDetails);        

            foreach($payLinesWinDetailsArray as $val) {
                $valArray = explode(':',$val);
                $num_repeats    = $valArray[3];
                $won_str        = $valArray[4];

                for($i = 0; $i < $num_repeats; $i++) {                  

                    if(in_array($won_str[$i], $this->game->wilds)) {
                        continue;
                    }

                    array_push($won_sym, $won_str[$i]);
                    break;
                }

                $won_positions = array_merge( $won_positions, explode(',',$valArray[5]) );
                             
            }
        }

        $won_sym = array_unique($won_sym);

        return array($won_positions, $won_sym);
    }

    public function reSetForStrike() {

        $this->round->paylineWins  = $this->getPaylineWinsFormat();     
        $this->round->betLines     = Array();
        $this->round->paylineWinAmount = 0;
    }

    public function getScattersCount() {
        $scatter = $this->game->scatters[0];
        $numScatters = get_element_count($this->round->matrixFlatten, $scatter);

        return $numScatters;
    }

    public function checkSecBreath($prev_win) {
        $numScatters    = $this->getScattersCount();
		$bonus			= $this->game->bonusConfig;
		$min_count		= $bonus['bonus_config']['normal']['details']['min_count'];


        // If condition true means no win on the level 4. So need to start 
        // second breath round.
        // $this->round->winAmount stores wins from latest calculatePaylineWins()
        // $this->round->winAmount equals to $this->avalancheWinAmount means
        // no new win from latest win calculation.
        // Breath will be given only once.
        if( $this->avalancheCount >= $bonus['level_four'] 
            && ($this->round->winAmount <= $this->avalancheWinAmount) 
            && (!$this->secBreathFlag)
            && ($numScatters < $min_count) ) {

            $this->secBreathFlag = true;

            $prev_round_matrixstr   = $this->round->matrixString;
            $burst_matrix = array();
            $mat = $this->round->matrixFlatten;
            $bonus = $this->game->bonusConfig;
            $big_sym = $bonus['big_sym'];

            $rand_pos = get_random_number(0, count($mat) - 1); 


            while( in_array($mat[$rand_pos], $this->game->wilds) 
                    || in_array($mat[$rand_pos], $this->game->scatters) 
                    || in_array($mat[$rand_pos], $big_sym)) {
                
                $rand_pos = get_random_number(0, count($mat) - 1);
            }

            $rand_sym = $mat[$rand_pos];
            $rand_sym_pos = array();
            
            for($m = 0; $m < count($this->round->matrixFlatten); $m++) {
                if($this->round->matrixFlatten[$m] == $rand_sym) {
                    array_push($rand_sym_pos, $m);
                }
            }

            for($i=0;$i<$this->game->numRows;$i++)
            {
                for($j=0;$j<$this->game->numColumns;$j++)
                {
                    $burst_matrix[$i][$j]=1;
                    
                    if($this->round->matrix[$i][$j] == $rand_sym) {
                        $burst_matrix[$i][$j] = 0;
                    }
                }
            }

            $row = $rand_pos / $this->game->numColumns; //  not needed
            $col = $rand_pos % $this->game->numColumns; //  not needed
            $burst_matrix[$row][$col] = 0;              //  not needed


            $sticky_sym_matrix  = $this->getStickySymMatrix($burst_matrix);
            $moved_index        = $this->getmovedIndex($burst_matrix);
            $prev_reel_pointers = $this->round->reelPointers;
            $this->resetRound();            // *** Notice this reset.

            $this->round->reelPointers = $this->generateReelPointers($sticky_sym_matrix, $prev_reel_pointers); // uncomment this
            $busted_info = $this->genStickyElementMatrix($sticky_sym_matrix);
            $this->round->handlePostMatrixFeatures();
            $this->round->generateBetLines();
            $this->round->calculatePaylineWins();
            $moved_sym = $this->getMovedSym($moved_index);
            $curr_round_matrixstr   = $this->round->matrixString;

            return array(
                "post_aval_matrixstr" => $curr_round_matrixstr,
                "busted_matrix"       => $sticky_sym_matrix,
                "busted_index"        => $moved_index,
                "new_symbols"         => $moved_sym,
                "random_pos"          => $rand_pos,
                "random_sym"          => $rand_sym,
                "sym_pos"             => $rand_sym_pos,
                'win_amount'          => $prev_win,
            );
        }
    }

    public function setDetermination() {
        $bonus = $this->game->bonusConfig;
        $big_sym = $bonus['big_sym'];   

        for($i = 0; $i < count($big_sym); $i++) {
            array_push($this->game->wilds, $big_sym[$i]);
        }

    }

    // For client communication
    public function getMovedSym($moved_index) {
        $moved_sym = array();

        for($i = 0; $i < count($moved_index); $i++) {
            array_push($moved_sym, $this->round->matrixFlatten[$moved_index[$i]]);
        }
        
        return $moved_sym;
    }

    public function generateReelPointers($sticky_sym_matrix, $prev_reel_pointers) {
        $busted_count = $this->count_busted_sym($sticky_sym_matrix);
        $reel_pointers = [];

        for($i = 0; $i < count($prev_reel_pointers); $i++) {
            if($busted_count[$i] === 0) {
                $reel_pointers[$i] = $prev_reel_pointers[$i];
                continue;
            }
            
            $rounded_reel_pointer = $prev_reel_pointers[$i] - $busted_count[$i];
            if($rounded_reel_pointer < 0) {
                $reel_length = strlen($this->game->reels[$i]);
                $rounded_reel_pointer = ($reel_length) + $prev_reel_pointers[$i] - $busted_count[$i];
            }

            $reel_pointers[$i] = $rounded_reel_pointer;
        }

        return $reel_pointers;
    }

    /**
    * 
    * To count how many symbols busted on each reel
    */
    function count_busted_sym($matrix) {
        $temp_arr = Array();

        for($i = 0; $i < $this->game->numColumns; $i++) {
            $count = 0;
            for($j = 0; $j < $this->game->numRows; $j++) {
                if($matrix[$j][$i] == '0') {
                    $count++;
                }
            }
            array_push($temp_arr, $count);
        }

        return $temp_arr;
    }

    public function awardScatterWin($config)
    {
        if(isset($config['details'])) {
            $config = $config['details'];
        }

        $scatter = $this->game->scatters[0];
        $numScatters = get_element_count($this->round->matrixFlatten, $scatter);
        $pay_table = $this->game->payTable;
        $min_count = $config['min_count'];
        $screen_wins = array();
        $scat_pos = array();
        $len = count($this->round->matrixFlatten);

        for($i = 0; $i < $len; $i++) {
            if($scatter == $this->round->matrixFlatten[$i]) {
                array_push($scat_pos, $i);
            }
        }
        
        $key = $numScatters.$scatter;
        $win = 0;

        if(isset($pay_table[$key])) {
            $win = ($pay_table[$key] * $this->round->coinValue * $this->round->numCoins);
            $this->spinScreenWin = $win;
        }

        if($numScatters >= $min_count) {
            array_push($this->scatterFs, 
                array('num_fs' => $config['num_freespins'], 
                    'avl_count' => $this->avalancheCount));

            $screen_wins = array(
                'type' => 'screen_wins',
                'screen_symbol' => $this->round->game->scatters[0],
                'num_screen_symbols' => $numScatters,
                'win_amount' => $win,
                //'multipler' => $pay_table[$key],
                'symbol_positions' => $scat_pos,
            );

            array_push($this->round->screenWins, $screen_wins);
        }

        $avl_ind = $this->avalancheCount;
		$this->scatterWin[$avl_ind] = $screen_wins;


        return $screen_wins;
    }

    /*
    * Award FS at a time triggered from normal spin
    * and from avalanche awarded from that normal spin.
    * So collected freespins are awarded. 
    * TODO check this flow.
    */
    public function awardFreespins($config) {
        $total_fs = 0;

        if( count($this->scatterFs) > 0 ) {

            for($i = 0; $i < count($this->scatterFs); $i++) {
                $total_fs += $this->scatterFs[$i]['num_fs'];
            }
        }
        else {
            return ;
        }

        if(!$total_fs) {
            return false;
        }

        if(isset($config['details'])) {
            $config = $config['details'];
        }
        else {
            return false;
        }

		if( !isset($this->game->misc['sub_games_config'])) {
            $fs_game_id = $config['fs_game_id'];
        }
        else {
            $fs_game_id     = $this->getFSSubGameId();
        }


        $base_round_id  = $this->round->roundId;
        $num_freespins  = $total_fs;
        $multiplier     = $config['multiplier']; 
        $num_betlines   = $config['num_betlines'];
        $round_ids      = [$this->round->roundId];
        $spin_type_id   = $config['spin_type_id'];
        $history        = '';
        $details        = array(
                    'fs_multiplier' => $multiplier,
                    'fs_game_id'    => $fs_game_id,
                    'parent_type'   => $this->round->spinType
                    );

        award_freespins($this->game->gameId, $this->game->subGameId,
                    $this->accountId, $base_round_id,
                    $num_freespins, $multiplier,
                    $this->round->coinValue, $this->round->numCoins,
                    $num_betlines, $this->round->amountType,
                    $round_ids, $history, $spin_type_id, $details);

        $this->setNextRound($num_freespins, $multiplier);
    }

    public function setNextRound($num_freespins, $multiplier)
    {
        if($num_freespins) {
            $this->round->nextRound['num_spins'] = $num_freespins;
            $this->round->nextRound['spins_left'] = $num_freespins;
            $this->round->nextRound['fs_multiplier'] = $multiplier;
            $this->round->nextRound['type'] = 'freespins';

            array_push($this->round->bonusGamesWon, $this->round->nextRound);
        }
    }

    /**
    * @fun getBurstedRawMatrix
    * will return a matrix having 0 at won positions and 1 at all remaining positions
     */

    public function getBurstedRawMatrix() {
        $burst_matrix 	= array();
        $pos 			= array();
        $bet_line_num 	= array();

        if ( isset($this->round->paylineWins['details'])
            && ($this->round->paylineWins['details'] != "") ) {

            // format: "betline_number;win;blink;num_repeats;betline;matrix_positions"
            //          1:50:11100:3:wgghh:0,1,2;
            // $pos an array stores all won positions in a flat matrix.
            // These won positions will disappear in avalanche.
            $details = explode(";", $this->round->paylineWins['details']);

            for ($i=0; $i < count($details) ; $i++) {
                $temp = explode(":", $details[$i]);
                $positions = explode(",", $temp[5]);
                array_push($bet_line_num, $temp[0]);

                for($j = 0; $j < count($positions); $j++) {
                    array_push($pos, $positions[$j]);
                }
            }


            if( is_array($this->strikeDetails) &&
                isset($this->strikeDetails['strike_won_pos']) ) {

                $pos = array_merge($pos, $this->strikeDetails['strike_won_pos']);
            }

        }

        
        // Find position of scatter symbols if scatter win is there
        $count 			= array_count_values($this->round->matrixFlatten);
		$bonus			= $this->game->bonusConfig; 
        $min_count		= $bonus['bonus_config']['normal']['details']['min_count'];
        $scatter_sym    = $this->game->scatters[0];

        if (in_array($scatter_sym, $this->round->matrixFlatten) && $count[$scatter_sym] >= $min_count) {
            $temp = array_keys($this->round->matrixFlatten, $scatter_sym);
            $pos = array_merge($pos,$temp);
        }

        $pos = array_unique($pos);
        $pos = array_values($pos);

        for($i=0;$i<$this->game->numRows;$i++)
        {
            for($j=0;$j<$this->game->numColumns;$j++)
            {
                $burst_matrix[$i][$j]=1;
            }
        }

        for($i = 0; $i < count($pos); $i++) {
            $row = $pos[$i] / $this->game->numColumns;
            $col = $pos[$i] % $this->game->numColumns;
            $burst_matrix[$row][$col] = 0;
        }

        // If win pos reset $burst_matrix to blank array.
        if( count($pos) <= 0) {
            $burst_matrix = array();
        }

        return array($burst_matrix, $bet_line_num, $pos);
    }
     
    public function transposeMatrix($original_matrix) {
        $transposed_matrix = array();

        for($i=0; $i<count($original_matrix); $i++){
            for($j=0; $j<count($original_matrix[0]); $j++)
                $transposed_matrix[$j][$i] = $original_matrix[$i][$j];
        }

        return $transposed_matrix;
    }

    // For client communication
    public function getmovedIndex($burst_matrix) {
        $moved_index = array();

        for($m = 0; $m < $this->game->numColumns; $m++) {
            $flag = 0;
            for($n = $this->game->numRows - 1; $n >= 0; $n-- ) {
                if( ($burst_matrix[$n][$m] == 0) || ($flag) ) {
                    array_push($moved_index, $n * $this->game->numColumns + $m);
                    $flag = 1;
                } 
            }
        
        }

        return $moved_index;
    }

    public function getStickySymMatrix($burst_matrix) {
        $sticky_element_matrix = array();

        for($i = 0; $i < $this->game->numRows; $i++)
        {
            for($j = 0; $j < $this->game->numColumns; $j++)
            {
                $sticky_element_matrix[$i][$j]="0";
            }
        }

        for($j = 0; $j < $this->game->numColumns; $j++)
        {
            $temp_counter = $this->game->numRows - 1;

            for($i = $this->game->numRows - 1; $i >= 0; $i--)
            {
                if($burst_matrix[$i][$j] == 1)
                {
                    $sticky_element_matrix[$temp_counter][$j] = $this->round->matrix[$i][$j];
                    $temp_counter--;
                }
            }
        }
        
        return $sticky_element_matrix ;
    }

    public function genStickyElementMatrix($previous_matrix)
    {   
        $this->round->generateMatrix();
        $elem_matrix    = $this->round->matrix; 
        $busted_sym = array();
        $busted_index = array();
        
        for($i = 0; $i < $this->game->numRows; $i++)
        {
            for($j = 0; $j < $this->game->numColumns; $j++)
            {
                if($previous_matrix[$i][$j] == "0")
                {
                    $previous_matrix[$i][$j] = $elem_matrix[$i][$j];
                    $mat_index = ($i * $this->game->numColumns) + $j;
                    array_push($busted_index, $mat_index);
                    array_push($busted_sym, $previous_matrix[$i][$j]);
                }
            }
        }

        $this->round->matrix        = $previous_matrix;
        $this->round->matrixString  = array2d_to_string($this->round->matrix);
        $this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);

        return [$busted_index, $busted_sym];
    }

    /*
    * @fun resetRound 
    * Before calculating avalanche win reset some round object variables.
    * So that they will not effect the win and prize calculations 
    * after avalanche triggered.
    **/
    public function resetRound() {
        $this->round->reelPointers = array(); 
        $this->round->paylineWins  = $this->getPaylineWinsFormat();
        //$this->round->winAmount    = 0;
        $this->round->betLines     = Array();
        $this->round->paylineWinAmount = 0;
    }

    public function getPaylineWinsFormat() {
        return Array(
            'format'  => Array('betline_number', 'win', 'blink','num_repeats',
                               'betline', 'matrix_positions'),
            'details' => Array());
    }
}
?>
