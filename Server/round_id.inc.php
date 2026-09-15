<?php
/**
 * @class RoundId
 * @author 
 * @created 20 June 2018
 *
 * @code example
 *      $roundIdObj = new RoundId('round_id');
 *      $roundId = $roundIdObj->nextRoundId();
 *      assert($roundId == $roundIdObj->currentRoundId());
 */

require_once 'round_id_interface.class.php';

class RoundId implements IRound {
    var $name;

    /**
     * @func __constructor
     * @arg1 name Name for which round ID is requested for
     * @arg2 seed seed for round ID
     * @arg3 increments step value of the round Id generated
     */
    public function __construct($name, $seed = null, $stepUp = null) {
        global $db;

        $this->name = $name;

        if($seed != null or $stepUp != null) {
            $rs = $db->runQuery("CALL round_id.new_category('{$name}', {$seed}, {$stepUp});");
        }
    }

    /**
     * @func nextRoundId()
     *
     * @return Returns round ID
     */
    public function nextRoundId() {
        global $db;

        $rs = $db->runQuery("SELECT round_id.next_round_id('{$this->name}');");
        $row = $db->fetchRow($rs);
        if(!$row) {
            throw new Exception("ROUNDID001: Category does not exist");
        }
        if(!$row[0]) {
            throw new Exception("ROUNDID002: Round ID is not configured");
        }

        return $row[0];
    }

    /**
     * @func currentRoundId()
     *
     * @return Returns the current round ID
     */
    public function currentRoundId() {
        global $db;

        $rs = $db->runQuery("SELECT round_id.current_round_id('{$this->name}');");
        $row = $db->fetchRow($rs);
        if(!$row) {
            throw new Exception("ROUNDID003: Category is not found");
        }
        if(!$row[0]) {
            throw new Exception("ROUNDID004: Round ID is not configured");
        }

        return $row[0];
    }
}