 <?php 
// $txt = Array(Array(Array(",1,,1),Array(",1,,		
//             1),Array(",1,,1),Array(,1,,				
//             3)),
            
//             Array(Array("credit1"=>1,,1), Array(",1,"w, =>1), 		
//             Array(",1,,1), Array(,1,,1),               
//             Array(, => 0,"weigth" => 2 )));




// $a = ["akbcjdihgcjbfkadebjkhfabijdfchikeghikjfdhgieckwgje",
//  "deahjdijghfkiebckwjidfkbjkcfghbkachiejkahgikcdgejb", 
//  "akbcjdiegcjbfkadebjkhfabijdfchikeghikafdhgieckwgje", 
//  "akbcjdiegajbfkadebjkhfabijdfchajeghibafdhgieckwgje", 
//  "akbcjdibgcjbfkadcbjkhfabijdfchikeghikafdhgiechwgje"]
 
$reels = [
    "abhabbiachiebahbfsabfadfhiahishgdghigbsahdgbefiaahsifdbhcbhbaafbefbdiisbabbasiichaebgbhaaffsigcigebg",
    "abaabbimchieadfssafmafchibhimhgdghegssahdgbefiaaheifdmhcbhbbmifbefbdissbabbadiimhaemgbhaafssigcigebg",
    "abaaibbhchiemadgfsafcamcabbaimhgdghegbsahdgbefiaahsifdbhcbhbmicfbefbdiisbabbasiichaemgbhaaffsigcigebg",
    "abaaibbhchiemadgfsafcamcabbaimhgdghegbsahdgbefiaahsifdbhcbhbmicfbefbdiisbabbasiichaemgbhaaffsigcigebg",
    "abambbihchssbdfssafdfacaibaissgdghegbsshdgbssiaahssfdbhcbmbafaabefbdimcbabbassichaebgbhaafssigcigebg",
    "abaabbihchiebdfssafdfacaibaissgdghegbsshdgbssiaahssfdbhcbheafaabefbdsscbabbassichadbgbhaafssigcigebg"
];
//  echo $reels[0][10];
//  echo $reels[0][53];
//  echo $reels[0][54];
//  echo $reels[0][55];


// $a = {"H1"=>"a","H2"=>"b","H3"=>"c","H4"=>"d",
    //     "L1"=>"e","L2"=>"f","L3":"g","L4":"h",
    //     "L5":"i","MU":"m","SC":"s"}
$total_weight = 100000;
$win_amount = array("20000" => 2, "40000" => 3,  "55000" => 4,  "70000" => 5,  "76000" => 6,  "86000" => 8,  "91000" => 10,  "95000" => 12,  "97500" => 15,  "99000" => 20, "99900" => 25,  "99985" => 50,  "99997" => 100,  "99999" => 250,  "100000" => 500);
$reel = Array(
    		//Bonus 2           
    		Array('s', 'b', 'd', 'c', 's','s'),  // 5
    		Array('s', 'm', 'b', 'm', 'f', 'b'), // 11
    		Array('f', 's', 'b', 's', 'm',"b"),  // 17
    		Array('m', 'd', 'm', 'b', 'b',"b"),  // 23
    		Array('c', 'd', 's', 'a', 'b',"e")); // 29

            
$multiplier_heap = array();
$cols = 6;
$rows = 5;
$screenWins = array_fill(0, $rows * $cols, 0);
$matrixString = array2d_to_string($reel);
$matrixFlatten = generateFlatMatrix($reel);


$screenWins = multipler_feature();
//  echo "before = \n";
//  print_r(implode(',', $screenWins));

// for ($tryf=0; $tryf < 2; $tryf++) { 
//     for ($col = 0; $col < $cols; $col++) {
//         for ($row = 0; $row < $rows; $row++) {
//             if($reel[$row][$col] == "m"){
//                 $val = ($row * $cols) + $col;
//                 if(in_array($val, $multiplier_heap ) == false){
//                     array_push($multiplier_heap,$val);
//                 }
//             }
//         }
//     }
//     if ($tryf == 0 ){
//         $reel = Array(
//     		//Bonus 2           
//     		Array('s', 'b', 'd', 'c', 's','s'),
//     		Array('s', 'm', 'b', 'm', 'f', 'b'),
//     		Array('m', 's', 'b', 'a', 'm',"b"),
//     		Array('a', 'd', 'm', 'a', 'b',"b"),
//     		Array('m', 'd', 's', 's', 'b',"e"));
//             $matrixString = array2d_to_string($reel);
//             $matrixFlatten = generateFlatMatrix($reel);
//     }
//     if ($tryf ==1 ){
//         $reel = Array(
//     		//Bonus 2           
//     		Array('s', 'b', 'd', 'm', 's','s'),
//     		Array('s', 'b', 'b', 'a', 'f','m'),
//     		Array('m', 's', 'b', 's', 'b',"b"),
//     		Array('a', 'm', 'm', 'b', 'b',"b"),
//     		Array('m', 'd', 's', 'm', 'm',"e"));
//             $matrixString = array2d_to_string($reel);
//             $matrixFlatten = generateFlatMatrix($reel);
//     }

//     for ($col = 0; $col < $cols; $col++) {
//         for ($row = 0; $row < $rows; $row++) {
//             // $matrix[$row][$col] = $new_sym;
//             if($col == 3){
//                 $reel[$row][$col];
//             }
//             if($reel[$row][$col] == "m"){
//                 $index_val = ($row * $cols) + $col; 
//                 for ($n=$row; $n >= 0; $n--) {
//                     if (in_array($index_val, $multiplier_heap) && (($row * $cols) + $col) != $index_val && $screenWins[$index_val]>0 && $screenWins[(($row * $cols) + $col)] == 0  ) {

//                         $screenWins[($row * $cols) + $col] = $screenWins[$index_val];
//                         array_splice($multiplier_heap, $index_val, 1);
//                         array_push($multiplier_heap, ($row * $cols) + $col);
//                         $screenWins[$index_val] = 0;
//                         if($reel[$n][$col] == "m"){
//                             $screenWins[$index_val] = getMultiplierValue($total_weight, $win_amount);
//                         }
//                         break;
//                     }
//                         if($index_val  >= $cols){
//                             $index_val -= 6;
//                         }
//                     }
//                 // echo "came";
//                 if($reel[$row][$col]  == "m" && $screenWins[($row * $cols) + $col] == 0){
//                     $screenWins[($row * $cols) + $col] = getMultiplierValue($total_weight, $win_amount);
//                     array_push($multiplier_heap, ($row * $cols) + $col);
//                 // }
//                 }
//             }
//         }
//     }
//     echo "\n after ". $tryf. "  = \n";
    
//     print_r(implode(',', $screenWins));
// }


// OUTPut

function generateFlatMatrix($reel)
    {
        $tempArray = array();
        for ($i = 0; $i < 5; $i++) {
            for ($j = 0; $j < 6; $j++) {
                array_push($tempArray, $reel[$i][$j]);
            }
        }
        return $tempArray;
    }

function array2d_to_string($arr, $delimiter1='', $delimiter2=';')
{
	$temp_array = Array();
	foreach($arr as $index => $value) {
		array_push($temp_array, implode($delimiter1, $value));
	}
	return implode($delimiter2, $temp_array);
}

function multipler_feature()
{
    global $total_weight, $win_amount, $screenWins, $reel, $matrixFlatten;
    $multipler_symbol = "m";
        $found = array_keys($matrixFlatten, $multipler_symbol);
        // for ($i = 0; $i < count($found); $i++) {
        //     $screenWins[$found[$i]] = getMultiplierValue($total_weight, $win_amount);
        // }
    return $screenWins;
}

function getMultiplierValue($total_weight, $win_amount)
	{
		$rand = rand(1, 3);
		echo $rand,"   ";
		foreach ($win_amount as $key => $value) {
			// echo "key = ", $key;
			if ($key >= $rand) {
				return $value;
			}
		}
	}
// for ($i=0; $i 
 

 $a = [3, 2, 1];
 $b = [ 2, 1];

// for ($i=0; $i < count($a); $i++) {
//      $num = $a[$i];
//      if($num )
// }
 $v = "har";

 $aa = strrev($v);
 echo $aa;

?>


