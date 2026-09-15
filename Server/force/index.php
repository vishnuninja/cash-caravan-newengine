<html>
    <title>Force Tool</title>
    <head>
        <link rel="stylesheet" type="text/css" href="assets/force_tool_style.css" />
        <script type="text/javascript" src="assets/jquery.js"></script>
        <script type="text/javascript" src="assets/jquery.cookie.js"></script>
        <script type='text/javascript' src ="assets/force_tool_script.js"></script>
        <script>
            $(document).ready(function(){
                show_games_list();
            });
        </script>
    </head>
    <body>
        <div id='games_list' style='display:none' ></div>
        <div id='forcing_player_id'><center>Player ID &nbsp;&nbsp;<input type='text' id='forced_account_id' value='' size='14'/><center></div>
        <div id="submit_button">
            <button class='buttons' onclick ='return force_outcome();' >Force Outcome</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
            <button class='buttons' onclick ='return unforce_outcome();' >UnForce Outcome</button>
            <br/>
            <div id='status_message' style='display: none'></div><br/>
        </div>

        <div id="reels_area">
            <div id='choosen_game_reels' style='display:none;'></div>
        </div>

        <div id ='output_zone' class='output_zone' style='display:none'>
            <div id='reels_outcome' style='display:none'></div>
            <div id='post_data_form' style='display:none;'>&nbsp;
                <center><div id='symbol_positions'></div><br/><center>
            </div>
        </div>
    </body>
</html>