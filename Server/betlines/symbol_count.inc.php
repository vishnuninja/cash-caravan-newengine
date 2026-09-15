<?php

require_once 'ibetlines.inc.php';

class SymbolCountLines implements iBetLines
{
    
    private $game;
    private $round;

    public function __construct(&$game, &$round)
    {
        $this->game = $game;
        $this->round = $round;
        // $this->num = 7;
    }

    public function generateBetLines()
    {
        // $rows is dynamic for game guardianofprosperity . 
        //Its different for different reels(cols) in FS
        //


        // todo
        // check thumble with index 
        
        $rows = $this->game->numRows;
        $cols = $this->game->numColumns;
        $elementMatrix = $this->round->matrix;
        $position = $this->round->reelPointers;
        $symbol_config = $this->game->symbolConfig;
        $matrixFlatten = $this->round->matrixFlatten;
        $betines_samp = array_count_values($matrixFlatten);
        $betines_samp = $this->checkArraySize($betines_samp);
        $betline = array();
        $arr = array();
        $matrixString = "";
        $count = 0;
        // $screenWins = array_fill(0, $rows*$cols, 0);
        $screenWins = $this->round->screenWins;
        $screenWinAmount = 0;
        $screenWinAmount = array_sum($this->round->screenWins);
        
        
        $symbol_con = "";
        if($symbol_config["symbol_check"]){
            $symbol_con = $symbol_config["symbol_check"][$this->round->spinType];
        }
        $new_sym_ponter = array();
        while (count($betines_samp) > 0) {
            $count++;
            $sym_key = array();
            $new_sym_ponter = array();
            $removeSymbolMatrix = array();
            $matrixPosition = array();
            foreach ($betines_samp as $key => $value){
                if($key == "s" || $key == "m" ){
                    continue;
                }
                array_push($sym_key, $key);
                $found = array_keys($matrixFlatten, $key);
                $matrixPosition = array_merge($matrixPosition,$found);
                $newMetrix_data = $this->removeSymbolMatrix($rows, $cols, $elementMatrix, $key, $position, $screenWins, $new_sym_ponter);
                $removeSymbolMatrix = $newMetrix_data[0];
                $screenWins = $newMetrix_data[2];
                $new_sym_ponter = $newMetrix_data[3];                
                $elementMatrix = $removeSymbolMatrix;
                $bet_line = array($key =>$value);
                array_push($betline, $bet_line);
            }
            $newdata = $this->generateNewMatrix($rows, $cols,$position, $removeSymbolMatrix ,$symbol_con , $screenWins );

            $newMatrix = $newdata[0];
            $position = $newdata[1];
            $screenWins = $newdata[2];
            $new_symbol_s = $newdata[3];
            $elementMatrix = $newMatrix;

            $matrixFlatten = $this->round->generateFlatMatrix($newMatrix);
            $matrixString = array2d_to_string($elementMatrix);
            $this->round->matrixFlatten = $matrixFlatten;
            $this->round->matrix = $elementMatrix;
            $arr["screenWins"] = $screenWins;
            $arr["new_reel"] = $matrixString;
            $arr["new_symbols"] = $new_symbol_s;
            $arr["old_reel_symbol"] = $sym_key;
            $arr["postions"] = $matrixPosition;
            array_push($this->round->miscPrizes ,$arr);
            $screenWinAmount = array_sum($screenWins);
            $betines_samp = array_count_values($matrixFlatten);
            $betines_samp = $this->checkArraySize($betines_samp);

        }
        // echo "multiplier win = ", $screenWinAmount;
        $this->round->screenWinAmount = $screenWinAmount;
        $this->round->miscPrizes["count"] = $count;
        $this->round->betLines = $betline;
        $this->round->numBetLines = 1;
        $this->round->postMatrixInfo['matrixString'] = $matrixString;
        if($this->round->screenWinAmount > 0 ){
            $this->round->postMatrixInfo["symbol"] = "m";
            $this->round->postMatrixInfo["win"] = $this->round->screenWinAmount;
            $multiplier = array();
            for ($i=0; $i < count($screenWins); $i++) { 
                if($screenWins[$i] > 0 ){
                    array_push($multiplier,$screenWins[$i] );
                }
            }
            $this->round->postMatrixInfo["count"] = count($multiplier);
            $this->round->postMatrixInfo["multiplier"] = $multiplier;
        }
        if(count($betline) > 0){
            $this->round->numBetLines = count($betline);
        }
        }

function removeSymbolMatrix($rows, $cols, $matrix, $key, $position,$screenWins, $new_sym_ponter){
    $sym_pointer = $new_sym_ponter;
    for($i = 0; $i < $rows; $i++) {
        for($j = 0; $j < $cols; $j++) {
            if($matrix[$i][$j] == $key) {
                $matrix[$i][$j] = 'x';
                $this->round->matrixData[$i][$j]["symbol"] = $matrix[$i][$j];
            }
        }
            
    }
    return array($matrix, $position, $screenWins, $sym_pointer);
}

    function generateNewMatrix($rows, $cols,$reel_pointer, $matrix,$symbol_config, $screenWins) {
        $screenWins = array();
        $transpose = function($arr) {
            return array_map(null, ...$arr);
        };
        $transpose_matrix = $transpose($matrix);
        $transpose_matrixData = $transpose($this->round->matrixData);
        foreach($transpose_matrixData as $i => $row) {
            foreach($row as $j => $cell) {
                if ($cell['symbol'] == 'x') {
                    unset($transpose_matrixData[$i][$j]);
                }
                
            }
        }
        $new_symbol_s = "";
        for($x = 0; $x < $cols; $x++) {  //TODO  use matrix col  , remove transpose matrix 
            $reel = $transpose_matrix[$x];
            $dataReel = $transpose_matrixData[$x];
            // Removing 'x' from reel
            $reel = array_filter($reel, function($ele) {
                return $ele != 'x';
            });
            $num = $reel_pointer[$x];
            $len = count($reel);
            $new_sym = "";
            for($y = 0; $y < (count($transpose_matrix[$x]) - $len); $y++) {
                // Adding new symbols to reel
                $n = (--$num + strlen($this->game->reels[$x])) % strlen($this->game->reels[$x]);
                array_unshift($reel, $this->game->reels[$x][$n]);
                $new_sym .= $this->game->reels[$x][$n];
                array_unshift($dataReel, Array("symbol" => $this->game->reels[$x][$n], "data" => 0));
                $reel_pointer[$x] = $n;
            }   
            strrev($new_sym);
            $new_symbol_s .= strrev($new_sym);
            $new_symbol_s .= ";";  
            $transpose_matrix[$x] = $reel;
            $transpose_matrixData[$x] = $dataReel;
        }
        $matrix = $transpose($transpose_matrix);
        $this->round->matrixData = $transpose($transpose_matrixData);
        foreach ($this->round->matrixData as $i => $row) {
            foreach ($row as $j => $cell) {
                
                if ($cell['symbol'] == 'm' && $cell['data'] == '0') {
                    $this->round->matrixData[$i][$j]['data'] = $this->round->getMultiplierValue($symbol_config["total_weight"], $symbol_config["win_amount"]);
                }
                // $screenWins[] = $cell['data'];
            }
        }
        foreach ($this->round->matrixData as $row) {
            foreach ($row as $cell) {
                $screenWins[] = $cell['data'];
            }
        }
        return array($matrix, $reel_pointer,$screenWins,$new_symbol_s);
    }


    function checkReelStrip($col_pos, $count, $col){
        // position = 2, 97, 0
        // count = 4 to decrese value
        for ($i=0; $i < $count; $i++) {
            // 3
            if($col_pos == 0){
                $col_pos = strlen($this->game->reels[$col])-1;
            }
            else{
                $col_pos -= 1;
            }
        }
        return $col_pos;
    
    }

    function checkArraySize($betines_samp){
        foreach ($betines_samp as $key => $value) {
            if($key == "m" || $key == "s"){
                unset($betines_samp[$key]);
            }
            if ($value < 8 ){
                unset($betines_samp[$key]);
            }
            }
        return $betines_samp;
    }


}
?>
