<?php
/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * kaluab implementation : © August Delemeester haphazardeinsteinaugdog@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.

 */
declare(strict_types=1);

namespace Bga\Games\kaluab;

require_once(APP_GAMEMODULE_PATH . "module/table/table.game.php");

class Game extends \Table
{
    private static array $CARD_TYPES;

    /**
     * Here, you can assign labels to global variables you are using for this game. You can use any number of global
     * variables with IDs between 10 and 99.
     *
     * NOTE: afterward, you can get/set the global variables with `getGameStateValue`, `setGameStateInitialValue` or
     * `setGameStateValue` functions.
     */
    public function __construct()
    {
        parent::__construct();

        $this->initGameStateLabels([
            
            "Active_Draw" => 10,
            "Free_Action" => 20,
            "Active_Turn" => 30,
            "Non-active_Turn" => 31,
            "Card_Effect" => 32,
            "Continue_Turn" => 33,
            "Convert" => 40,
            "Gain_Prayer" => 50,
            "Eliminate_Players" => 60,
            "Check_Winner" => 61,
            "Check_Tie" => 62,
            "Active_Player_Increment" => 70,
            "End_Game" => 99,
        ]);        
        
        self::$CARD_TYPES = [
            1 => [
                "card_name" => clienttranslate('Troll'), // ...
            ],
            2 => [
                "card_name" => clienttranslate('Goblin'), // ...
            ],
            // ...
        ];

/*      //Make two decks: bonus and disaster
        $this->disasterCards = $this->getNew( "module.common.deck" );
        $this->disasterCards ->init( "disaster_card" );
        $this->bonusCards = $this->getNew( "module.common.deck" );
        $this->bonusCards ->init( "bonus_card" );
    } */

    /**
     * Player action, example content.
     *
     * In this scenario, each time a player plays a card, this method will be called. This method is called directly
     * by the action trigger on the front side with `bgaPerformAction`.
     *
     * @throws BgaUserException
     */
    public function actPlayCard(int $card_id): void
    {
        // Retrieve the active player ID.
        $player_id = (int)$this->getActivePlayerId();

        // check input values
        $args = $this->argPlayerTurn();
        $playableCardsIds = $args['playableCardsIds'];
        if (!in_array($card_id, $playableCardsIds)) {
            throw new \BgaUserException('Invalid card choice');
        }

        // Add your game logic to play a card here.
        $card_name = self::$CARD_TYPES[$card_id]['card_name'];

        // Notify all players about the card played.
        $this->notifyAllPlayers("cardPlayed", clienttranslate('${player_name} plays ${card_name}'), [
            "player_id" => $player_id,
            "player_name" => $this->getActivePlayerName(),
            "card_name" => $card_name,
            "card_id" => $card_id,
            "i18n" => ['card_name'],
        ]);

        // at the end of the action, move to the next state
        $this->gamestate->nextState("playCard");
    }

    public function actPass(): void
    {
        // Retrieve the active player ID.
        $player_id = (int)$this->getActivePlayerId();

        // Notify all players about the choice to pass.
        $this->notifyAllPlayers("cardPlayed", clienttranslate('${player_name} passes'), [
            "player_id" => $player_id,
            "player_name" => $this->getActivePlayerName(),
        ]);

        // at the end of the action, move to the next state
        $this->gamestate->nextState("pass");
    }

    /**
     * Game state arguments, example content.
     * This method returns some additional information that is very specific to the `playerTurn` game state.
     *
     * @return array
     * @see ./states.inc.php
     */
    public function argPlayerTurn(): array
    {
        // Get some values from the current game situation from the database.

        return [
            "playableCardsIds" => [1, 2],
        ];
    }

    /**
     * Compute game progression: return an integer between 0 and 100.
     * This method is called each time we are in a game state with the "updateGameProgression" property set to true.
     *
     * @return int
     * @see ./states.inc.php
     */
    public function getGameProgression()
    {
        // TODO: compute and return the game progression
        //pick player with most families

        return 0;
    }

    /**
     * Game state action, example content. The action method of state `nextPlayer` is called everytime the current game state is set to `nextPlayer`.
     */
    public function stNextPlayer(): void {
        // Retrieve the active player ID.
        $player_id = (int)$this->getActivePlayerId();

        // Give some extra time to the active player when he completed an action
        $this->giveExtraTime($player_id);
        
        $this->activeNextPlayer();

        // Go to another gamestate
        // Here, we would detect if the game is over, and in this case use "endGame" transition instead 
        $this->gamestate->nextState("nextPlayer");
    }

    /*
     * Migrate database - You don't have to care about this until your game has been published on BGA. 
     * @param int $from_version
     * @return void

     * Gather all information about current game situation (visible by the current player).
     * The method is called each time the game interface is displayed to a player (game starts, game refreshes (F5))
     */
    protected function getAllDatas()
    {
        $result = [];

        // WARNING: We must only return information visible by the current player.
        $current_player_id = (int) $this->getCurrentPlayerId();

        // Get information about players.
        // NOTE: you can retrieve some extra field you added for "player" table in `dbmodel.sql` if you need it.
        $result["players"] = $this->getCollectionFromDb(
            "SELECT `player_id` `id`, `player_score` `score` FROM `player`"
        );

        // TODO: Gather all information about current game situation (visible by player $current_player_id).

        return $result;
    }

    /**
     * Returns the game name.
     *
     * IMPORTANT: Please do not modify.
     */
    protected function getGameName()
    {
        return "kaluab";
    }

    /**
     * This method is called only once, when a new game is launched. In this method, you must setup the game
     *  according to the game rules, so that the game is ready to be played.
     */
    protected function setupNewGame($players, $options = [])
    {
        // Set the colors of the players with HTML color code. The default below is red/green/blue/orange/brown. The
        // number of colors defined here must correspond to the maximum number of players allowed for the gams.
        $gameinfos = $this->getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        //Get # of players
        $players_nbr = count( $players );

/*         //Need to flesh out the decks... example of array below 
        //Create 1 card of type "1" with type_arg=99,
        //  and 4 cards of type "2" with type_arg=12,
        //  and 2 cards of type "3" with type_arg=33
        $cards = array(
            array( 'type' => 1, 'type_arg' => 99, 'nbr' => 1 ),
            array( 'type' => 2, 'type_arg' => 12, 'nbr' => 4 ),
            array( 'type' => 3, 'type_arg' => 33, 'nbr' => 2 )
        );

        $this->cards->createCards( $cards, 'deck' ); */

        //setup dice function? Game "Abyss" as example?

        foreach ($players as $player_id => $player) {
            // Now you can access both $player_id and $player array
            $query_values[] = vsprintf("('%s', '%s', '%s', '%s', '%s')", [
                $player_id,
                array_shift($default_colors),
                $player["player_canal"],
                addslashes($player["player_name"]),
                addslashes($player["player_avatar"]),
            ]);
        }

        // Create players based on generic information.
        //
        // NOTE: You can add extra field on player table in the database (see dbmodel.sql) and initialize
        // additional fields directly here.
        static::DbQuery(
            sprintf(
                "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES %s",
                implode(",", $query_values)
            )
        );

        $this->reattributeColorsBasedOnPreferences($players, $gameinfos["player_colors"]);
        $this->reloadPlayersBasicInfos();

        // Init global values with their initial values.

        //families on island = $players_nbr*3

        // // Initialize something casewise?
        // switch ($this->getGameStateValue('$players_nbr')) {
        //     default:
        //         $start_points = 50;
        //         break;
        //     case 1:
        //         $start_points = 75;
        //         break;
        //     case 2:
        //         $start_points = 100;
        //         break;
        // }

        // Dummy content.
        //$this->setGameStateInitialValue("my_first_global_variable", 0);

        // Init game statistics.
        // NOTE: statistics used in this file must be defined in your `stats.inc.php` file.

        // TODO: Setup the initial game situation here.

        // Activate first player
        $this->activeNextPlayer();
    }

    /**
     * This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
     * You can do whatever you want in order to make sure the turn of this player ends appropriately
     * (ex: pass).
     *
     * called when the player leaves the game. This action is triggered
     * from the main site so you must _never_ use `getCurrentPlayerId()` or `getCurrentPlayerName()`, otherwise it will fail with a
     * "Not logged" error message.
     *
     * @param array{ type: string, name: string } $state
     * @param int $active_player
     * @return void
     * @throws feException if the zombie mode is not supported at this game state.
     */
    protected function zombieTurn(array $state, int $active_player): void
    {
        $state_name = $state["name"];

        if ($state["type"] === "activeplayer") {
            switch ($state_name) {
                default:
                {
                    $this->gamestate->nextState("zombiePass");
                    break;
                }
            }

            return;
        }

        // Make sure player is in a non-blocking status for role turn.
        if ($state["type"] === "multipleactiveplayer") {
            $this->gamestate->setPlayerNonMultiactive($active_player, '');
            return;
        }

        throw new \feException("Zombie mode not supported at this game state: \"{$state_name}\".");
    }
}
