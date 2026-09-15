<?php
class SpinHandler
{
    var $game, $round;
    public function __construct(&$game, &$round)
    {
        $this->game = $game;
        $this->round = $round;
    }

    public static function handleSpin(&$game, &$round)
    {
        $spinHandler = new SpinHandler($game, $round);
        $spinHandler->doSpin();
    }

    private function doSpin()
    {
        $this->loadNewGame();
        $this->round->resetRound();
        $this->round->mystFeature(); // Avi
        $this->round->generateReelPointers();
        $this->round->generateMatrix();
        // 6*4 at 40 position at 4th reel  
        /* @func handlePostMatrixFeatures.This is used to so the changes in
        *       the generated matrix. Like replacing some symbols. Used to
        *       handle the cases such as sticky to fixed the symbols form
        *       previous spin .
        */
        // s 40 reel pointer
        $this->round->handlePostMatrixFeatures(); # todo need to handle this case
        $this->round->generateBetLines();
        $this->round->calculatePaylineWins();
        $this->round->handlePostWinCalculations();
        $this->round->calculatescattersymbolwin(); # LOTR scatter win cal
        $this->round->handleReSpins(); # todo chinesedynasty . To play the
        $this->round->handleBonusGames();
        $this->round->handleFreeSpins();
	    $this->round->handlePostFreeSpinPrizes();
        $this->round->handleScreenWins();
        $this->round->handleQueuedBonus();
        $this->round->decrementAndLoadFreeSpins();
        // $this->round->handleAfterWinBonus();
        // Need to handle below call from handle_bonus_round() of casino lib also.
        // When playing bonus round control will not come here.
        // This is only for spins where generating reels
        $this->round->setPromoFs();

    }

    private function loadNewGame()
    {
        $newSubGameId = $this->round->getNewSubGameId();

        /**
         * @todo as of now setting only subGameId and reels
         *       need to see what all other values to be set
         */
        // echo $newSubGameId;
        if($this->game->subGameId != $newSubGameId) {
            
            $newSubGame = Game::loadGame($this->game->gameId, $newSubGameId);
            $this->game->subGameId = $newSubGame->subGameId;
            $this->game->description = $newSubGame->description; # todo added here for review
            $this->game->spinType = $newSubGame->spinType; # todo added here for review
            $this->game->wilds = $newSubGame->wilds; # todo added here for review
            $this->game->scatters = $newSubGame->scatters; # todo added here for review
            $this->game->reels = $newSubGame->reels;
            $this->game->bonusConfig = $newSubGame->bonusConfig;
            $this->game->symbolConfig = $newSubGame->symbolConfig;
            $this->game->numRows = $newSubGame->numRows;
            $this->game->numColumns = $newSubGame->numColumns;
            $this->game->unitySymbols = $newSubGame->unitySymbols;
            $this->game->paylines = $newSubGame->paylines;
            $this->game->misc     = $newSubGame->misc;
            unset($newSubGame);
            
        }
    }
}
?>
