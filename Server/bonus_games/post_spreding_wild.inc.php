<?php
require_once 'ibonus.inc.php';
/**
 * 
 */
class SpreadingWild extends BonusPickGame
{
	public function checkAndGrantBonusGame()
	{
		$misc = $this->game->misc;
		
		$spinType = $this->round->spinType;
		$multiplier  = $misc['multiplier'][$spinType];
		if ($spinType == 'freespin') {
            $multiplier = $this->round->freeSpins['details']['bonus_details'];
        }

		$hotspots = $misc['hotspots'];
		$wildSym = $misc['wild_symbol'];
		$kingSpot = $misc['king_hotspot'];

		$index = $kingSpot["index"];
		$indexes = $kingSpot["indexes"];

		$fMatrix = $this->round->matrixFlatten;
		foreach ($hotspots as $key => $value) {
			if ($fMatrix[$key] == $wildSym) {
				$hotspots[$key] = "true";
				if (isset($multiplier[$key]) && $spinType == 'freespin') {
					$multiplier[$key]++;
				}
			}
			if ($fMatrix[$index] == $wildSym) {
				for ($i=0; $i < count($indexes); $i++) { 
					$fMatrix[$indexes[$i]] = $wildSym;
				}
				$this->round->matrixFlatten = $fMatrix;
				$this->game->misc['spread_wild'] = "true";
			}
		}
		$this->game->misc['hotspots'] = $hotspots;
		$this->game->misc['multiplier'][$spinType] = $multiplier;
	}
}

?>