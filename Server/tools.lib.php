<?php
/**
 * @file tools.lib.php
 *
 * @desc Contains various functions which are used in general.
 *       like encode(), decode(), parse(), split(), implode()
 *
 * @note You may add any other extra generic tool/lib functions
 */

# Serializes the given array to object
function encode_objects($data_arrary)
{
    if(!$data_arrary or $data_arrary == null or $data_arrary == '') {
        return null;
    }

    return json_encode($data_arrary);
}

# Deserializes the given object to array
function decode_object($serialized_object, $associative_array=true)
{
    if(!$serialized_object or $serialized_object == null or $serialized_object == '') {
        return Array();
    }

    return json_decode($serialized_object, $associative_array);
}

/**
 * @desc
 *	Accepts array of arrays() and retunrs string. 1D array
 *	ex: Array('a','b','c')
 *		and return 'abc;def;ghi'
 */
function array1d_to_string($arr, $delimiter=';')
{
	return implode($delimiter, $arr);
}

/**
 * @desc
 *	Accepts array of arrays() and retunrs string. 2D array
 *	ex: Array(Array('a','b','c'), Array('d','e','f'), Array('g', 'h', 'i'))
 *		and return 'abc;def;ghi'
 */
function array2d_to_string($arr, $delimiter1='', $delimiter2=';')
{
// {"": ""}
// {0: "i", 1: "f", 2: "", 3: "", 4: "", "": ""}
// {0: "g", -1: ""}
// {-1: ""}
// {0: "f", 1: "f", 2: "e", 3: "", -1: ""}
// {0: "i", 1: "f", 2: "", -1: ""}


// ";fi;g;;ffe;fi"

	$temp_array = Array();
	foreach($arr as $index => $value) {
		array_push($temp_array, implode($delimiter1, $value));
	}
	return implode($delimiter2, $temp_array);
}

function to_base_currency($amount)
{
	return (float)$amount / 100;
}

function to_coin_currency($amount)
{
	return (float)$amount * 100;
}

# following function is not used
function get_weighted_random_element($weights, $values)
{
    $count = count($weights);
    $cumulative_sum = 0;
    $cumulative_weights = Array();

    for($i = 0; $i < $count; $i++) {
        $cumulative_sum += $weights[$i];
        array_push($cumulative_weights, $cumulative_sum);
    }

    $random_number = get_random_number(0, $cumulative_sum);
}

#todo run this function to calculate the accuracy
function weighted_random_number($weights, $values)
{
    $weights_sum = array_sum($weights);

    # todo following min. Should this be 1 or 0
    $rand   = get_random_number(1, $weights_sum);
    $curw   = 0;

    for($i = 0; $i < count($weights); $i++) {
        $curw += $weights[$i];
        if($curw >= $rand) {
            break;
        }
    }
    return $values[$i];
}

#todo run this function to calculate the accuracy
function get_weighted_index($weights)
{
    $weights_sum = array_sum($weights);

    # todo following min. Should this be 1 or 0
    $rand   = get_random_number(1, $weights_sum);
    $curw   = 0;

    for($i = 0; $i < count($weights); $i++) {
        $curw += $weights[$i];
        if($curw >= $rand) {
            break;
        }
    }
    return $i;
}
function get_symbol_count($flat_matrix, $symbols) {
    $num_scatters = 0;
    foreach($symbols as $index => $symbol) {
        $num_scatters += get_element_count($flat_matrix, $symbol);
    }

    return $num_scatters;
}
function round_half($amount)
{
    return round($amount,2);
}
?>
