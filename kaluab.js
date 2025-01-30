/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * kaluab implementation : © August Delemeester haphazardeinsteinaugdog@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * kaluab.js
 *
 * kaluab user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

 define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock",
    "ebg/zone",
],
function (dojo, declare) {
    return declare("bgagame.kaluab", ebg.core.gamegui, {
        constructor: function(){
            console.log('kaluab constructor');

            // Use for other images to minimize load time?
            this.dontPreloadImage('d6.png');

            document.getElementById('game_play_area').insertAdjacentHTML('beforeend', `
                <div id="board_background">
                    <div id="hkboard"></div>
                    <div id="atheistFamiliesZone"></div>
                </div>
                <div id="player-tables" class="zone-container"></div>
            `);

            // Define dimensions for hkzone
            const hkZoneWidth = 64; // Set to desired width
            const hkZoneHeight = 80; // Set to desired height

            // Define dimensions for atheist families zone
            const atheistFamiliesZoneWidth = 400 - hkZoneWidth; // Set to desired width
            const atheistFamiliesZoneHeight = 265 - hkZoneHeight; // Set to desired height

            // Zone control
            this.hkzone = new ebg.zone();
            this.hkzone.create(this, 'hkboard', hkZoneWidth, hkZoneHeight);

            // Zone for atheist families
            this.atheistFamiliesZone = new ebg.zone();
            this.atheistFamiliesZone.create(this, 'hkboard', atheistFamiliesZoneWidth, atheistFamiliesZoneHeight);
            
        },
        
        setup: function(gamedatas) {
            console.log("Starting game setup");

            // Define player hand dimensions
            const playerHandWidth = 800;
            const playerHandHeight = 200;

            // Create player areas
            const playerAreas = document.getElementById('player-tables');
            Object.values(gamedatas.players).forEach(player => {
                playerAreas.insertAdjacentHTML('beforeend', `
                    <div id="player_area_${player.id}" class="player_area">
                        <div class="player_name">${player.name}</div>
                        <div id="${player.id}_cards" class="player_cards"></div>
                        <div id="${player.id}_families" class="player_families"></div>
                    </div>
                `);

                // Create zones for player cards
                this[`player_${player.id}_cards_zone`] = new ebg.zone();
                this[`player_${player.id}_cards_zone`].create(this, `${player.id}_cards`, playerHandWidth, playerHandHeight);

                // Create zones for player families
                this[`player_${player.id}_families_zone`] = new ebg.zone();
                this[`player_${player.id}_families_zone`].create(this, `${player.id}_families`, playerHandWidth, playerHandHeight);
                
                // Initialize player families stock
                this[`player_${player.id}_families_stock`] = new ebg.stock();
                this[`player_${player.id}_families_stock`].create(this, $(`${player.id}_families`), 30, 30);
                this[`player_${player.id}_families_stock`].image_items_per_row = 10;

                // Add three families to each player's families stock
                for (let i = 0; i < 3; i++) {
                    this[`player_${player.id}_families_stock`].addItemType(i, i, g_gamethemeurl+'img/30_30_meeple.png', i);
                    this[`player_${player.id}_families_stock`].addToStockWithId(i, i);
                }

                // Initialize player stock hktokens
                this[`player_${player.id}_hktokens`] = new ebg.stock();
                this[`player_${player.id}_hktokens`].create(this, $(`${player.id}_families`), 30, 30);
                this[`player_${player.id}_hktokens`].image_items_per_row = 10;

                // Add one hktoken to each player's stock and to the hkzone
                this[`player_${player.id}_hktokens`].addItemType(0, 0, g_gamethemeurl+"img/30_30_hktoken.png", 0);
                this[`player_${player.id}_hktokens`].addToStockWithId(0, 0);
                this.hkzone.placeInZone($(`${player.id}_families`));
            });

            // Setting up players' side panels
            Object.values(gamedatas.players).forEach(player => {
                // Setting up players' side panels
                this.getPlayerPanelElement(player.id).insertAdjacentHTML('beforeend', `
                    <div> Prayer count: <span id="player_panel_${player.id}"></span> <br> happiness: <br> cards here?</div>
                `);

                // Create counter per player in player panel
                const counter = new ebg.counter();
                counter.create(document.getElementById(`player_panel_${player.id}`));
                counter.setValue(5);
            });

            // TODO: Set up your game interface here, according to "gamedatas"

            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log("Ending game setup");
        },
       
        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function(stateName, args) {
            console.log('Entering state: ' + stateName, args);
            
            switch(stateName) {
                // Example:
                // case 'myGameState':
                //     // Show some HTML block at this game state
                //     dojo.style('my_html_block_id', 'display', 'block');
                //     break;
                case 'dummy':
                    break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function(stateName) {
            console.log('Leaving state: ' + stateName);
            
            switch(stateName) {
                // Example:
                // case 'myGameState':
                //     // Hide the HTML block we are displaying only during this game state
                //     dojo.style('my_html_block_id', 'display', 'none');
                //     break;
                case 'dummy':
                    break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function(stateName, args) {
            console.log('onUpdateActionButtons: ' + stateName, args);
                      
            if(this.isCurrentPlayerActive()) {            
                switch(stateName) {
                    case 'playerTurn':    
                        const playableCardsIds = args.playableCardsIds; // returned by the argPlayerTurn

                        this.statusBar.addActionButton('Give a Speech');
                        this.statusBar.addActionButton('Convert Atheist');
                        this.statusBar.addActionButton('Convert Believer');
                        this.statusBar.addActionButton('Sacrifice Leader');
                        // Add test action buttons in the action status bar, simulating a card click:
                        // playableCardsIds.forEach(
                        //     cardId => this.addActionButton(`actPlayCard${cardId}-btn`, _('Play card with id ${card_id}').replace('${card_id}', cardId), () => this.onCardClick(cardId))
                        // ); 

                        this.addActionButton('actPass-btn', _('Pass'), () => this.bgaPerformAction("actPass"), null, null, 'gray'); 
                        break;
                }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
            Here, you can define some utility methods that you can use everywhere in your javascript
            script.
        */

        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        */
        
        // Example:
        onCardClick: function(card_id) {
            console.log('onCardClick', card_id);

            this.bgaPerformAction("actPlayCard", { 
                card_id,
            }).then(() =>  {                
                // What to do after the server call if it succeeded
                // (most of the time, nothing, as the game will react to notifs / change of state instead)
            });        
        },    

        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your kaluab.game.php file.
        */
        setupNotifications: function() {
            console.log('notifications subscriptions setup');
            
            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe('cardPlayed', this, "notif_cardPlayed");
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe('cardPlayed', this, "notif_cardPlayed");
            // this.notifqueue.setSynchronous('cardPlayed', 3000);
        },  
        
        // TODO: from this point and below, you can write your game notifications handling methods
        
        /*
        Example:
        
        notif_cardPlayed: function(notif) {
            console.log('notif_cardPlayed');
            console.log(notif);
            
            // Note: notif.args contains the arguments specified during your "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        */
   });             
});
