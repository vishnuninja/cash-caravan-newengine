<?php
    include_once "csprng.lib.php";
    $cycle = 1000000000;
    $count = Array(
        1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0,
        6 => 0, 7 => 0, 8 => 0, 9 => 0, 10 => 0);

    $start_time = microtime(true);
    for($i = 0; $i < $cycle; $i++)
    {
        $rand_num = get_random_number(1, 10);
        $count[$rand_num]++;
    }
    $end_time = microtime(true);

    print_r($count);
    print $end_time -  $start_time;
    print "\n";
?>
