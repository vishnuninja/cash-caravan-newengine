<?php

$reels = [
    "abhabbiachiebahbfsabfadfhiahishgdghigbsahdgbefiaahsifdbhcbhbaafbefbdiisbabbasiichaebgbhaaffsigcigebg",
    "abaabbimchieadfssafmafchibhimhgdghegssahdgbefiaaheifdmhcbhbbmifbefbdissbabbadiimhaemgbhaafssigcigebg",
    "abaaibbhchiemadgfsafcamcabbaimhgdghegbsahdgbefiaahsifdbhcbhbmicfbefbdiisbabbasiichaemgbhaaffsigcigebg",
    "abaaibbhchiemadgfsafcamcabbaimhgdghegbsahdgbefiaahsifdbhcbhbmicfbefbdiisbabbasiichaemgbhaaffsigcigebg",
    "abambbihchssbdfssafdfacaibaissgdghegbsshdgbssiaahssfdbhcbmbafaabefbdimcbabbassichaebgbhaafssigcigebg",
    "abaabbihchiebdfssafdfacaibaissgdghegbsshdgbssiaahssfdbhcbheafaabefbdsscbabbassichadbgbhaafssigcigebg"
];

/**
 * Summary of g
 * $position = [14,20,21,25,26,27];
 * $rows = 6;$cols = 5;$rows = "a";
 * $matrix = array(
   *  array("b", "m", "m", "a", "s"),
   *  array("e", "g", "c", "f", "s"),
   *  array("f", "b", "a", "s", "a"),
   *  array("i", "h", "b", "s", "f"),
   *  array("a", "a", "b", "i", "d"),
   *  array("a", "a", "a", "g", "f"),
 *);
 * 
 */
// function generateNewMatrix($position, $rows, $cols, $matrix, $key){
//     global $reels;
//     $dupposition = $position;
//     //ab hab
//     for ($row=0; $row < $rows; $row++) {  
//         $dumb_symbol = array();
//         for ($col = 0; $col < $cols; $col++) {  
//             $row_sym = $dupposition[$row];
//             if($matrix[$col][$row] == $key){  
//                 $num = $col;
//                 while($num >= 0){
//                     if(in_array($row_sym, $dumb_symbol) == false){
//                         $row_sym = checkReelStrip($row_sym, $row, $dumb_symbol);
//                         $matrix[$num][$row] = $reels[$row][$row_sym];
//                         $num--;
//                     }
//                     else{
//                         $row_sym = checkReelStrip($row_sym,$row, array());
//                     }
//                 }
//                 array_push($dumb_symbol,$dupposition[$row] );
//             }
//                 $dupposition[$row]++;
        
//         }
//         echo "--\n\n";
//     }
//     return $matrix;
// }

// function checkReelStrip($row_sym, $row,  $dumb_symbol){
//     global $reels;
//     if ($row_sym == 0){
//         $row_sym = strlen($reels[$row])-1;
//     }
//     elseif ($row_sym == strlen($reels[$row])-1) {
//         $row_sym = 0;
//     }
//     else{
//         $row_sym--;
//     }
//     while(in_array($row_sym, $dumb_symbol)){
//         $row_sym--;
//     }
//     return $row_sym;

// }

// $position = [0, 87, 100,25,26,27];
// $rows = 5;$cols = 6;$key = "a";
// $matrix = array(
//     array("a", "a", "g"),
//     array("b", "a", "a"),
//     array("h", "f", "b")
// );

$reels = [
    "abhabbiachiebahbfsabfadfhiahishgdghigbsahdgbefiaahsifdbhcbhbaafbefbdiisbabbasiichaebgbhaaffsigcigebg",
    "abaabbimchieadfssafmafchibhimhgdghegssahdgbefiaaheifdmhcbhbbmifbefbdissbabbadiimhaemgbhaafssigcigebg",
    "abaaibbhchiemadgfsafcamcabbaimhgdghegbsahdgbefiaahsifdbhcbhbmicfbefbdiisbabbasiichaemgbhaaffsigcigebg",
    "abaaibbhchiemadgfsafcamcabbaimhgdghegbsahdgbefiaahsifdbhcbhbmicfbefbdiisbabbasiichaemgbhaaffsigcigebg",
    "abambbihchssbdfssafdfacaibaissgdghegbsshdgbssiaahssfdbhcbmbafaabefbdimcbabbassichaebgbhaafssigcigebg",
    "abaabbihchiebdfssafdfacaibaissgdghegbsshdgbssiaahssfdbhcbheafaabefbdsscbabbassichadbgbhaafssigcigebg"
];

// print_r(generateNewMatrix($position, $rows, $cols, $matrix, $key));

// echo  strlen("abhabbiachiebahbfsabfadfhiahishgdghigbsahdgbefiaahsif");
// echo  strlen("abaabbimchieadfssafmafchibhimhgdghegssahdgbefiaaheifdmhc");
// echo  strlen("abaaibbhchiemadgfsafcamcabbaimhgdghegbsahdg");


$escape_sym = [141,142];
$index = 138; // 138
$rows = 6;
$arr = array();
for ($row=0; $row < $rows; $row++) {
    echo $rows;
    if($index == 150){
        break;
    }
    if(in_array($index,$escape_sym) == false){
        array_push($arr, $index);
        // $matrix[$row][$col] = $this->game->reels[$col][$index];
        $index+=1;
    }else{
        $index+=1;
        $rows += 1;
    }
}

print_r($arr);
?>