/*!
 * @desc This function creates and returns XMLHTTPRequest object for asynchronous
 *       calls i.e. for AJAX calls
 */
function get_async_object()
{
    var xhr;

    try{
        xhr = new XMLHttpRequest();
    }
    catch(err){
        try{
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch(err2){
            try{
                xhr = new ActiveXObject('Msxml2.XMLHTTP');
            }
            catch(err3){
                xhr = false;
            }
        }
    }
    return xhr;
}

/*!
 * @desc makes asynchronous POST request to server
 */
function send_post_request(async_obj, target_file, params)
{
    async_obj.open("POST", target_file, true);
    async_obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    async_obj.send(params);
}

/*!
 * @desc This function gets list of games from backend
 *       to show in drop down list of force tool
 */
function show_games_list()
{
    var async_obj = get_async_object();
    var params = "&request_type=games_list";
    send_post_request(async_obj, "game_details.php", params);

    async_obj.onreadystatechange  = function()
    {
        if(async_obj.readyState  == 4 && async_obj.status  == 200)
        {
            var responseObj = eval('('+ async_obj.responseText +')');
            $("#games_list").attr("style", "display:block");
            $("#games_list").html(String(responseObj.games_list));
        }
    };
}

/*!
 * @desc This function gets the reels of the selected game and
 *       displays on reels area so that they can be chosen for forcing
 */
function display_game_reels()
{
    var config_id = $('#games_list_options').val();
    var async_obj= get_async_object();
    var params = "&request_type=get_game_reels&config_id=" + config_id + "&";
    
    send_post_request(async_obj, "game_details.php", params);
    async_obj.onreadystatechange  = function()
    {
        if(async_obj.readyState  == 4 && async_obj.status  == 200)
        {
            var responseObj = eval('('+ async_obj.responseText +')');
            $('#choosen_game_reels').html(String(responseObj.game_reels));
            $('#reels_outcome').html(String(responseObj.default_outcome));
            $('#symbol_positions').html(String(responseObj.default_positions));
            $('#status_message').html(String(""));

            $("#choosen_game_reels").attr("style", "display:block");
            $("#reels_outcome").attr("style", "display:block");
            $("#output_zone").attr("style", "display:block");
            $("#post_data_form").attr("style", "disply:block");

            show_default_outcome(); // Show default outcome of reels
        }
    };
}

/*!
 * @desc show default outcome of reels
 *       Outcome is from 1st position to game's #rows
 */
function show_default_outcome()
{
    var num_reels = get_num_reels();
    for(var i = 0; i < num_reels; i++) {
        set_outcome(i + "_reel_0");
    }
}

/*!
 * @desc: Sets the outcome choosen by the user for forcing
 */
function set_outcome(clicked_index_data)
{
    var num_rows = get_num_rows();
    var data = clicked_index_data.split("_reel_");
    var reel_index = parseInt(data[0]);
    var clicked_index = parseInt(data[1]);
    var reel_legth = parseInt(get_reel_length(reel_index));
    var outcome_str = "";

    if(num_rows <= reel_legth)
    {
        for(var i = 0; i < num_rows; i++)
        {
            var symbol_position = (clicked_index + i) % reel_legth;
            var image_id = "#" + String(reel_index) + "_image_"+ String(symbol_position);
            var image_path = $(image_id).attr("src");
            outcome_str += "<img src='"+ image_path +"' class='outcome_reel_str'/><br>";
        }
    }

    $("#forced_outcome_"  + (reel_index+1)).html(String(outcome_str));
    $("#forced_position_" + (reel_index+1)).html(String(clicked_index + 1));
    $("#forced_position_" + (reel_index+1)).attr("value", (clicked_index + 1));
}

/*!
 * @desc return number of rows from cookie
 */
function get_num_rows() {
    return parseInt(get_cookie('num_rows'));
}

/*!
 * @desc returns number of reels from cookie
 */
function get_num_reels() {
    return parseInt(get_cookie('num_reels'));
}

/*!
 * @desc returns the length of given reel from cookie
 */
function get_reel_length(reel_index) {
    return parseInt(get_cookie('length_of_reel_' + reel_index));
}

/*!
 * @desc returns forced reel positions
 */
function get_forced_positions()
{
    var num_reels = get_num_reels();
    var positions = "";

    for(var i = 1; i <= num_reels; i++)
    {
        var temp_id = "#forced_position_" + i;
        positions += $(temp_id).attr("value") + ';';
    }

    return positions.substring(0, positions.length-1);
}

/*!
 * desc forces the outcome choosen by the user
 */
function force_outcome()
{
    $("#status_message").attr("style", "display:block;");
    $("#status_message").html("Forcing is in progress");
    
    var async_obj = get_async_object(); 
    var forced_positions = get_forced_positions();
    var config_id = get_cookie('config_id');
    var game_name = get_cookie('game_name');
    var account_id = $("#forced_account_id").val();
    var params = "request_type=force_outcome&forced_positions=" + forced_positions +
                "&config_id=" + config_id + "&game_name=" + game_name + "&account_id=" + account_id;
    
    send_post_request(async_obj, "game_details.php", params);

    async_obj.onreadystatechange  = function()
    {
        if(async_obj.readyState  == 4 && async_obj.status  == 200)
        {
            $("#status_message").attr("style", "display:block;");
            $("#status_message").html(async_obj.responseText);
            $("#status_message").fadeIn("slow");
            $("#status_message").fadeOut(3000);
        }
    };
}

/*!
 * @desc nnforces the outcome that has been forced
 */
function unforce_outcome()
{
    var async_obj = get_async_object(); 
    var game_name = get_cookie('game_name');
    var account_id = $("#forced_account_id").val();
    var params = "request_type=unforce_outcome&game_name=" + game_name + "&account_id=" + account_id;
    
    send_post_request(async_obj, "game_details.php", params);
    async_obj.onreadystatechange  = function()
    {
        if(async_obj.readyState  == 4 && async_obj.status  == 200)
        {
            $("#status_message").attr("style", "display:block;");
            $("#status_message").html(async_obj.responseText);
            $("#status_message").fadeIn("slow");
            $("#status_message").fadeOut(3000);
        }
    };
}

/*!
 * @desc: Set cookie value of given cookie
 */
function set_cookie(cookie_name, cookie_value) {
    Cookies.set(cookie_name, cookie_value, {expires: 1});
}

/*!
 * @desc: Returns the value of given cookie
 */
function get_cookie(cookie_name) {
     return Cookies.get(cookie_name);
}

/*!
 * @desc: Removes the given cookie
 */
function delete_cookie(cookie_name) {
    Cookies.remove(cookie_name);
}