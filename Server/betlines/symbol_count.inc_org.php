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
            $newdata = $this->generateNewMatrix($position, $removeSymbolMatrix ,$val, $screenWins,$multiplier_arr, $multiplier_pos );
            $newMatrix = $newdata[0];
            $position = $newdata[1];
            $new_symbol_s = $newdata[2];
            $screenWins = $newdata[3];
            $multiplier_arr = $newdata[4];
            $multiplier_pos = $newdata[5];
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
            // $samp_arr = array();//0,1,2,3,4,5
            $reel = $this->game->reels[$col];
            for($i = 0; $i < count($matrix); $i++) {
                for($j = 0; $j < count($matrix[$i]); $j++) {
                    
                    if($matrix[$i][$j] == $key) {
                        $this->round->matrixData[$i][$j]["symbol"] = $matrix[$i][$j];
                        $matrix[$i][$j] = 'x';
                    }
                }
            }
            // }
        }
        return array($matrix, $position, $screenWins, $sym_pointer);
}

    function generateNewMatrix($reel_pointer,  $matrix,$symbol_config, $screenWins, $multiplier_arr, $multiplier_pos){
        // echo "!";
        // print_r($matrix);
        $new_symbol = array();
        $new_symbol_s = "";
        $transpose = function($arr) {
            return array_map(null, ...$arr);
        };
        $m_reel = array();
        $transpose_matrix = $transpose($matrix);

        for($x = 0; $x < (count($matrix) + 1); $x++) {
            $reel = $transpose_matrix[$x];
            // Removing 'x' from reel

            $reel = array_filter($reel, function($ele) {
                return $ele != 'x';
            });
            
            $m_reel = array_filter($reel, function($ele) {
                return $ele == 'm';
            });

            $num = $reel_pointer[$x];
            $len = count($reel);
            $new_sym = "";
            $index  = (count($transpose_matrix[$x])-1) - $len;
            for($y = 0; $y < (count($transpose_matrix[$x]) - $len); $y++) {
                // Adding new symbols to reel
                $n = (--$num + strlen($this->game->reels[$x])) % strlen($this->game->reels[$x]);
                array_unshift($reel, $this->game->reels[$x][$n]);
                $new_sym .= $this->game->reels[$x][$n];
                if($this->game->reels[$x][$n] == "m"){
                    $screenWins[($index  * (count($matrix) + 1)) + $x] = $this->round->getMultiplierValue($symbol_config["total_weight"], $symbol_config["win_amount"]);
                    array_push($multiplier_pos, ($index * (count($matrix) + 1)) + $x);
                }
                $index--;
            }
            strrev($new_sym);
            $new_symbol_s .= strrev($new_sym);

            $new_symbol_s .= ";";            
            // echo "after ";
            // print_r($reel);

            $m_updated_reel = array_filter($reel, function($ele) {
                return $ele == 'm';
            });
            // (
            //    [1] => m, [2] => m, 
            // )
            // Array
            // (
            //  [1] => m, [2] => m,  [4] => m, [5] => m
            // )
            //  first reverse new reel  5,4,2,1

            $old_mul_keys = array_reverse(array_keys($m_reel));
            $mul_keys = array_reverse(array_keys($m_updated_reel));
            if(count($old_mul_keys)>0){
                if ($old_mul_keys != $mul_keys){
                    for ($i = 0; $i < count($mul_keys); $i++) {
                        $num = $mul_keys[$i];
                        $small_num = 0;
                        for ($j = 0; $j < count($old_mul_keys); $j++) {
                            if ($num > $old_mul_keys[$j]) {
                                $small_num = $old_mul_keys[$j];
                                array_shift($old_mul_keys);
                                break;
                            }
                        }
                        // echo $mul_keys[$i]," , ", $small_num, "  ";
                        // print_r($old_mul_keys);
                        $screenWins[($num * (count($matrix) + 1)) + $x] = $screenWins[($small_num * (count($matrix) + 1)) + $x];
                        $screenWins[($small_num * (count($matrix) + 1)) + $x] = 0;
                        array_push($multiplier_arr, [$small_num * (count($matrix) + 1)+ $x, $num * (count($matrix) + 1)+ $x]);

                    }
                }
            }
            

            $transpose_matrix[$x] = $reel;
            $reel_pointer[$x] = $num;
        }
    
        $matrix = $transpose($transpose_matrix);
        // echo "new_ matrix";
        // print_r($matrix);
        // for ($col = 0; $col < $cols; $col++) {  //0,1,2,3,4,5
            
        //     $escape_sym = $this->dumb_symbol[$col];// 2
        //     $index = $position[$col]; // 40  38
        //     // echo $index;

        //     $org_index = $this->round->reelPointers[$col]; // 40
        //     $forLoopIndex = count($escape_sym)+ $rows;  // 2+6 = 8
        //     $forIndex = $index+$forLoopIndex; // 432+8 = 440
        //     $inc = 0;
        //     $prev_index = $new_sym_ponter[$col];
        //     for ($row=0; $row < $forLoopIndex; $row++) {
        //         // echo $index, "  ";
        //         if($forIndex == $index){ // TODO
        //             break;
        //         }
        //         // increase index in reel
        //         if(in_array($index, $escape_sym) == false){
        //             $new_sym = $this->game->reels[$col][$index];
        //             $matrix[$inc][$col] = $new_sym;
        //             if($index < ($position[$col]+$prev_index)){
        //                 $new_symbol_s .= $new_sym;
        //             }
        
        //             if($new_sym == "m"){
        //                 $index_val = ($inc * $cols) + $col; // 19
        
        //                 for ($n=$inc; $n >= 0; $n--) {
        //                     if (in_array($index_val, $this->multiplier_heap) && (($inc * $cols) + $col) != $index_val && $screenWins[$index_val]>0) {
        //                         $screenWins[($inc * $cols) + $col] = $screenWins[$index_val];
        //                         array_push($multiplier_arr,[$index_val,($inc * $cols) + $col]);
        //                         array_push($this->multiplier_heap, ($inc * $cols) + $col);
        //                         $screenWins[$index_val] = 0;
        //                         break;
        //                     }
        //                         if($index_val  >= $cols){
        //                             $index_val -= 6;
        //                         }
        //                     }
        //                 // echo "came";
        //                 if($new_sym == "m" && $screenWins[($inc * $cols) + $col] == 0){
        //                     $screenWins[($inc * $cols) + $col] = $this->round->getMultiplierValue($val["total_weight"], $val["win_amount"]);
        //                     array_push($multiplier_pos, ($inc * $cols) + $col);
        //                     array_push($this->multiplier_heap, ($inc * $cols) + $col);
        //                 // }
        //                 }
        //             }
                    
        //             $index+=1;
        //             $inc+=1;
        //         }else{
        //             $index+=1;
        //         }
        //         // if($index == strlen($this->game->reels[$col])){
        //         //     $index = 0;
        //         // }
        //         // else{
        //         //     $index += 1;
        //         //     }
        //         // echo $index, "  ";
        //         // check if reel index is not out of range
        //         if($index > strlen($this->game->reels[$col])-1){
        //             $index = 0;
        //         }
                
        //     }
        //     // echo "\n ";
        //     $new_symbol_s .= ";";
        //     // ######################################### NEW TRIAL ##########################################
        // }
        return array($matrix, $reel_pointer,$new_symbol_s, $screenWins ,$multiplier_arr, $multiplier_pos);
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
