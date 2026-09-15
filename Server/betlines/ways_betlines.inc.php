<?php

require_once 'ibetlines.inc.php';

class WaysBetlines implements iBetLines
{
    private $game;
    private $round;

    public function __construct(&$game, &$round)
    {
        $this->game = $game;
        $this->round = $round;
    }

    public function generateBetLines()
    {
        // $rows is dynamic for game guardianofprosperity . 
        //Its different for different reels(cols) in FS
        //
        $rows = $this->game->numRows; 
        $cols = $this->game->numColumns; 
        $elementMatrix = $this->round->matrix;
        $reverseMatrix = array();

        /**
         * converting rows to columns and columns to rows.
         * Will be easier to find all the positions of an element on each real
         * getNumRows() is in use below. It is helpful in the case when a games
         * has different number of row on different reels.
         */
        // dde;degagb;gcgdgg; 
        // [dde,degagb,gcgdgg,hfb]
        for($i = 0; $i < $cols; $i++) {
            $k = 0;
            $rows = $this->getNumRows($i);
            for($j = 0; $j < $rows; $j++, $k++) {
                $reverseMatrix[$i][$k] = $elementMatrix[$j][$i];
            }
        }

        // When 'wild' is present on first reel
        

        list($wildOnReelOne, $elementsArray) = $this->handleConsecutiveWildSymbols($reverseMatrix);
        
        $len = count($elementsArray); 
        $betlines = array();    
        
        for($i = 0; $i < $len; $i++)
        {
            $search_element = $elementsArray[$i];
            $betlines[$search_element]['count']=0;
            for($j = 0; $j < $cols; $j++) {
                $element_details = $this->getElementDetails($reverseMatrix[$j], $search_element); 
                if($element_details && !in_array($search_element, $this->game->wilds)) {
                    $betlines[$search_element]['indexes'][$j] = $element_details['indexes'];
                    $betlines[$search_element]['elements'][$j] = $element_details['elements'];
                    $betlines[$search_element]['count']++;
                }
                else
                    break;
            }
        }
        
        $combinations = array();
        foreach($betlines as $element => $elem_details)
        {
            if($elem_details['count'] > 1) {                
                $combinations[$element]['indexes'] = $this->getCombinations($elem_details['indexes']);               
                $combinations[$element]['elements'] = $this->getCombinations($elem_details['elements']);
            }
        }
        
        $betlines = $this->generateBetlinesstrings($combinations);
        
        if($wildOnReelOne == 1 || $wildOnReelOne == true) {
            $betlines = $this->handleWildLines($betlines);
        }
        
        $betlines = $this->arrangeBetlines($betlines);        
        $this->round->betLines = $betlines['bet_strings'];
        $this->round->numBetLines =  count($betlines['bet_strings']) > 0 ? count($betlines['bet_strings']): $this->round->numBetLines;
        $this->game->paylinesConfig = $this->getPaylineConfig($betlines);
        // print_r($betlines);
        // print_r($this->round->betLines);
        // print_r( $this->game->paylinesConfig);
        // echo $this->round->numBetLines;
    }

	/**
	 *  @fun getNumRows
	 *  To handle the variable reel length in a game. 
	 *  If all reel's are not of same length - Configure the
	 *  reels length in spin type key in bonus_config. key for 
	 *  the reels length should be reels_length. If its not set
	 *  num_rows will be taken by default.
	 * */
    public function getNumRows($reel_number) {
        $spin_type = $this->round->spinType;
        $conf = $this->game->bonusConfig;
        if( isset($conf['bonus_config'][$spin_type]['reels_length']) ) {
            $reels_length = $conf['bonus_config'][$spin_type]['reels_length'];
            
            return $reels_length[$reel_number];
        }    

        return $this->game->numRows;
    }

    public function getPaylineConfig($betlines) {
        $positions = $betlines['positions'];
        $matrix = array();
        $num_col = $this->game->numColumns;
        for($i = 0; $i < count($positions); $i++) {
            $positions_arr = str_split($positions[$i]);
            for($j = 0; $j < count($positions_arr); $j++ ) {
                $matrix[$i][$j] = $positions_arr[$j]*$num_col + $j;
            }
        }
        return $matrix;
    }

    private function arrangeBetlines($betlines)
    {
        $temp = Array(
            'positions' => Array(),
            'bet_strings' => Array(),
        );

        foreach($betlines as $key => $value)
        {
            $temp['positions'][] = $key;
            $temp['bet_strings'][] = $value;
        }

        return $temp;
    }

    private function generateBetlinesstrings($combinations)
    {
        $betlines = array();
        foreach($combinations as $element => $elem_details)
        {
            $indexes = $elem_details['indexes'];
            $elements = $elem_details['elements'];
            for($i = 0; $i < count($indexes); $i++)
            {
                $pos_betline = implode($indexes[$i]);
                $betlines[$pos_betline] = implode($elements[$i]);
            }
        }
        return $betlines;
    }

    private function handleWildLines($betlines)
    { 
        $wild_array = $this->game->wilds;
        $wild_betstrings = array(); 

        foreach($betlines as $poses => $betstring)
        {
            $len = strlen($betstring);
            $elem_count = 0;
            for($i = 0; $i < $len; $i++)
            {
                if(in_array($betstring[$i], $wild_array))
                    $elem_count++;
                else
                    break;
            }

            if($len == $elem_count)
                $wild_betstrings [$poses] = $betstring;
        }

        if($wild_betstrings)
            $betlines = $this->filterWildPaylines($betlines, $wild_betstrings);

        return $betlines;
    }

    private function filterWildPaylines($betlines, $wild_betstrings)
    {
        foreach($wild_betstrings as $pos => $wild_betstr)
        {
            $wild_len = strlen($wild_betstr);

            foreach($betlines as $key => $value)
            {
                if( strlen($value) > $wild_len && strpos($value, $wild_betstr) === 0)
                {
                    unset($betlines[$pos]);
                    break;
                }
            }
        }
        return $betlines;
    }

    private function handleConsecutiveWildSymbols($reverseMatrix)
    {
        $i = 0;
        $search_elements = array();
        $wild_on_first_reel = 0;
        while($this->checkWildOnReel($reverseMatrix[$i]))
        { 
            $search_elements = array_merge($search_elements, $reverseMatrix[$i]);
            $wild_on_first_reel = 1;
            $i++;
        }
        $search_elements = array_merge($search_elements, $reverseMatrix[$i]);
        $search_elements = array_values(array_unique($search_elements)); 

        return array($wild_on_first_reel, $search_elements);
    }

    private function getCombinations($elements, $i = 0) {
        if(!isset($elements[$i])) {
            return array();
        }
        if($i == count($elements) - 1) {
            return $elements[$i];
        }
        
        $temp = $this->getCombinations($elements, $i + 1);
        $combinations = array();
        
        foreach($elements[$i] as $value) {
            foreach($temp as $t_value) {
                $combinations[] = is_array($t_value) ? array_merge(array($value), $t_value) : array($value, $t_value);
            }
        }
        return $combinations;
    }

    private function checkWildOnReel($elements)
    {   
        $wild_array = $this->game->wilds;
        $count = count($elements);
        $flag = false;

        for($i = 0; $i < $count; $i++)
        { 
            if(in_array($elements[$i], $wild_array)) {
                $flag = true;
                break;
            }
        }

        return $flag;
    }

    private function getElementDetails($elements_arr, $search_element)
    {
        $wild_array = $this->game->wilds;

        $is_wildable = $this->checkWildable($search_element);
        $element_details = array();

        for($i = 0; $i < count($elements_arr); $i++)
        {
            if($is_wildable && ($search_element == $elements_arr[$i] 
                || in_array($elements_arr[$i], $wild_array) )) {
                $element_details['indexes'][] = $i;
                $element_details['elements'][] = $elements_arr[$i];
            }
            else if($search_element == $elements_arr[$i])
            {
                $element_details['indexes'][] = $i;
                $element_details['elements'][] = $search_element;
            }
        }
        return $element_details;
    }

    private function checkWildable($element)
    {
        if(isset($this->game->scatters[$element]) 
            || isset($this->game->bonus[$element]))
            return false;
        else
            return true;
    }

}
