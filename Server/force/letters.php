<html>
	<style>
	
	.letter{
  		color: white;
  		font-size: 60px;
  		border_radius: 10px;
  		font-weight: bolder;
	}

	.letter_area {
  		border: 3px solid darkgreen;
  		border-radius: 50%;
  		width: 60px;
  		background: darkgreen;
  		padding: 2px;
  		text-shadow:3px 3px 5px red;
	}

	
	</style>
</html>

<?php
$letters = array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');	

$letters_length = count($letters);


for($i=0; $i < $letters_length ; $i++) 
{
	 print '<div class="letter_area">
	 			<center>
	 				<div class="letter">' .$letters[$i].'</div>
	 			</center>
	 		</div><br>';
}

?>