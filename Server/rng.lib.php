<?php
/**
 * Desc: random_int() - Generates cryptographically secure pseudo-random integers
 *
 *       The random_int() function generates a random integer between the specified
 *       minimum and maximum values. It produces a better random value than the rand()
 *       and mt_rand() functions.
 *
 *       Parameters:
 *          min
 *              Optional lowest value to be returned (default: 0)
 *          max
 *              Optional highest value to be returned (default: mt_getrandmax())
 *
 * Source: https://www.php.net/manual/en/function.random-int.php
 */
function get_random_number($min, $max)
{
    return random_int($min, $max);
}
?>