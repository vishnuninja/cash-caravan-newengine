<?php

require_once 'ibetlines.inc.php';

class SymbolCountLines implements iBetLines
{
    
    private $game;
    private $round;

    var $num;
    var $dumb_symbol;
    var $multiplier_heap;
    public function __construct(&$game, &$round)
    {
        $this->game = $game;
        $this->round = $round;
        // $this->num = 7;
        $this->dumb_symbol = array();
        $this->multiplier_heap = array();
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
        $arr = array();
        $betline = array();
        $arr = array();
        $matrixString = "";
        $this->dumb_symbol = array_fill(0, $cols, array());
        $count = 0;
        // $screenWins = array_fill(0, $rows*$cols, 0);
        $screenWins = $this->round->screenWins;
        $screenWinAmount = 0;
        $screenWinAmount = array_sum($this->round->screenWins);
        
        $new_symbol = array();
        $elements = $this->game->elements;
        $noThumbele = true;
        
        $val = "";
        if($symbol_config["symbol_check"]){
            // echo $this->round->spinType;
            $val = $symbol_config["symbol_check"][$this->round->spinType];
        }
        // print_r($val);
        // print_r($elementMatrix);
        $val_p = 7;
        $new_sym_ponter = array();
        while (count($betines_samp) > 0) {
        // while (  $val_p > 0) {
            // echo count($betines_samp);
            $multiplier_arr = array();
            $count++;
            $multiplier_pos = array();
            $sym_key = array();
            $new_sym_ponter = array();
            $removeSymbolMatrix = array();
            $matrixPosition = array();
            // print_r($betines_samp);
            foreach ($betines_samp as $key => $value){
                if($key == "s" || $key == "m" ){
                    continue;
                }
                array_push($sym_key, $key);
                $found = array_keys($matrixFlatten, $key);
                $matrixPosition = array_merge($matrixPosition,$found);
                // echo "1";
                // $removeSymbolMatrix = $this->removeSymbolMatrix($rows, $cols, $elementMatrix, $key, $position);
                $newMetrix_data = $this->removeSymbolMatrix($rows, $cols, $elementMatrix, $key, $position, $screenWins, $new_sym_ponter);
                $removeSymbolMatrix = $newMetrix_data[0];
                // echo "old";
                // print_r($removeSymbolMatrix);
                // $position = $newMetrix_data[1]; 
                $screenWins = $newMetrix_data[2];
                $new_sym_ponter = $newMetrix_data[3];                
                $elementMatrix = $removeSymbolMatrix;
                $bet_line = array($key =>$value);
                array_push($betline, $bet_line);
            }
            // echo "came";
            // print_r($removeSymbolMatrix);
            $newdata = $this->generateNewMatrix($position, $removeSymbolMatrix ,$val, $screenWins,$multiplier_pos,$multiplier_arr );
            // $newMatrix = $newdata[0];
            // $position = $newdata[1];
            // $screenWins = $newdata[3];
            $newMatrix = $newdata[0];
            $position = $newdata[1];
            // $new_symbol_s = $newdata[2];
            $screenWins = $newdata[2];
            $new_symbol_s = $newdata[3];
            $multiplier_pos = $newdata[4];
            $multiplier_arr = $newdata[5];
            $elementMatrix = $newMatrix;
            // print_r($newMatrix);
            // $new_symbols = $newdata[1];
            // $screenWins = $newdata[2];
            // // echo "symbol_count";
            // // print_r($screenWins);

            $matrixFlatten = $this->round->generateFlatMatrix($newMatrix);
            $matrixString = array2d_to_string($elementMatrix);
            $this->round->matrixFlatten = $matrixFlatten;
            $this->round->matrix = $elementMatrix;
            $arr["screenWins"] = $screenWins;
            $arr["new_reel"] = $matrixString;
            // $arr["new_symbols"] = "";
            $arr["new_symbols"] = $new_symbol_s;
            $arr["old_reel_symbol"] = $sym_key;
            $arr["multiplier_arr"] = $multiplier_arr;
            $arr["multiplier_pos"] = $multiplier_pos;
            $arr["postions"] = $matrixPosition;
            $multiplier_arr = array(); 
            array_push($this->round->miscPrizes ,$arr);
            $screenWinAmount = array_sum($screenWins);
            // print_r($matrixFlatten);
            $betines_samp = array_count_values($matrixFlatten);
            // print_r($betines_samp);
            $betines_samp = $this->checkArraySize($betines_samp);
            if(count($betines_samp) == 0){
                $val_p = 0;
                $noThumbele = false;
            }
            $val_p--;
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
        for ($col = 0; $col < count($matrix); $col++) {
                        for($i = 0; $i < count($matrix); $i++) {
                for($j = 0; $j < count($matrix[$i]); $j++) {
                    if($matrix[$i][$j] == $key) {
                        $matrix[$i][$j] = 'x';
                        $this->round->matrixData[$i][$j]["symbol"] = $matrix[$i][$j];
                    }
                }
            }
        }
        return array($matrix, $position, $screenWins, $sym_pointer);
}

    function generateNewMatrix($reel_pointer, $matrix,$symbol_config, $screenWins, $multiplier_pos,$multiplier_arr) {
        $screenWins = array();
        $transpose = function($arr) {
            return array_map(null, ...$arr);
        };
        $multiplier_position_arr = array();
        $transpose_matrix = $transpose($matrix);
        $transpose_matrixData = $transpose($this->round->matrixData);
        foreach($transpose_matrixData as $i => $row) {
            $multiplier_position_arr[$i] = array();
            foreach($row as $j => $cell) {
                if ($cell['symbol'] == 'x') {
                    unset($transpose_matrixData[$i][$j]);
                }
                if($cell['symbol'] == "m"){
                    array_push($multiplier_position_arr[$i] , $j);
                }
            }
        }
        $cols = 6;
        $new_symbol_s = "";
        for($x = 0; $x < (count($matrix) + 1); $x++) {  //TODO  use matrix col  , remove transpose matrix 
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
            }   
            strrev($new_sym);
            $new_symbol_s .= strrev($new_sym);
            $new_symbol_s .= ";";  
            $transpose_matrix[$x] = $reel;
            $transpose_matrixData[$x] = $dataReel;
            $reel_pointer[$x] = $num;
        }
        $matrix = $transpose($transpose_matrix);
        $this->round->matrixData = $transpose($transpose_matrixData);

        foreach ($this->round->matrixData as $i => $row) {
            $multiplier_old_index = $multiplier_position_arr[$i];
            foreach ($row as $j => $cell) {
                
                if ($cell['symbol'] == 'm' && $cell['data'] == '1') {
                    $sym_index = ($i * (count($matrix) + 1)) + $j;
                    $current_index = $j;
                    if(in_array($sym_index,$multiplier_old_index[$j])== false){
                        for ($n=$sym_index; $n >= $cols; $n-=6) {
                            $current_index--;
                            $up_sym_index = ($i * (count($matrix) + 1)) + $current_index;
                            if (in_array($sym_index, $multiplier_old_index[$j])) {
                                array_push($multiplier_arr,[$up_sym_index,$sym_index]);
                            }
                        }
                    }
                }
                if ($cell['symbol'] == 'm' && $cell['data'] == '0') {
                    $this->round->matrixData[$i][$j]['data'] = $this->round->getMultiplierValue($symbol_config["total_weight"], $symbol_config["win_amount"]);
                    array_push($multiplier_pos, ($i * (count($matrix) + 1)) + $j);
                }
                $screenWins[] = $cell['data'];
            }
        }
        // foreach ($this->round->matrixData as $row) {
        //     foreach ($row as $cell) {
        //         $screenWins[] = $cell['data'];
        //     }
        // }
        return array($matrix, $reel_pointer,$screenWins,$new_symbol_s, $multiplier_pos,$multiplier_arr);
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
                if ($value < 8 ){
                    unset($betines_samp[$key]);
                }
            }
        return $betines_samp;
    }


}
?>
