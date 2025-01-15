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
              
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;

            //use for other images to minimize load time?
            this.dontPreloadImage( 'd6.png' );


        

        // Zone control        	
        this.hkboard = new ebg.zone();

        //zone.create( this, 'happyblock_r', 64, 64 );
        //zone.setPattern( 'verticalfit' );
        //zone.placeInZone( this.happyblock_r, 1 );

        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            console.log( "Starting game setup" );

            document.getElementById('game_play_area').insertAdjacentHTML('beforeend', `
                <div id="game_board_Wrap">
                    <div id="board_background">
                        <div id="hkboard">
                        </div>
                    </div>	
                </div>
                `);

            //create a prayer counter for each player
            //var counter = new ebg.counter();
            //counter.create(pcounter);
            
                /* try using stock to manage hk tokens
            this.hkboard = new ebg.stock();
            this.hkboard.create( this, $('hktokens'), this.cardwidth, this.cardheight );

            // Specify that there are 10 images per row in the CSS sprite image
            this.hkboard.image_items_per_row = 10;
            
            for( var value=2;value<=10;value++ )
                {
                    // Build card type id
                    var card_type_id = this.getCardUniqueId( value );
                    this.playerHand.addItemType( card_type_id, card_type_id, 'img/Cube_iso.png', card_type_id );
                }

            */
            


            // Example to add a div on the game area
            document.getElementById('game_play_area').insertAdjacentHTML('beforeend', `
                <div id="player-tables"></div>
            `);
            
            // Setting up player boards
            Object.values(gamedatas.players).forEach(player => {

                // example of setting up players boards
                this.getPlayerPanelElement(player.id).insertAdjacentHTML('beforeend', `
                    <div> Prayer count: <span id = "pc_loc"></span> <br> happiness: <br> cards here?</div>
                `);

                //rename div pc_loc with appended player id
                var ptable = ("pc_loc"+player.id);
                pc_loc.setAttribute("id", ptable);

                // example of adding a div for each player
                document.getElementById('player-tables').insertAdjacentHTML('beforeend', `
                    <div id= "player-table-"${player.id} >
                        <strong>${player.name}</strong>
                        <div> Setup player amulets, temples, etc here</div>
                    </div>
                `);
                
                //create counter per player in pc_loc div
                var counter = new ebg.counter();
                counter.create( document.getElementById(ptable));
                counter.setValue(5);
                
            });
            
            
            // TODO: Set up your game interface here, according to "gamedatas"
            
 
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log( "Ending game setup" );
        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName, args );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Show some HTML block at this game state
                dojo.style( 'my_html_block_id', 'display', 'block' );
                
                break;
           */
           
           
            case 'dummy':
                break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
            case 'dummy':
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName, args );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
                 case 'playerTurn':    
                    const playableCardsIds = args.playableCardsIds; // returned by the argPlayerTurn

                    this.statusBar.addActionButton('Give a Speech');
                    this.statusBar.addActionButton('Convert Atheist');
                    this.statusBar.addActionButton('Convert Believer');
                    this.statusBar.addActionButton('Sacrifice Leader');
                    //  Add test action buttons in the action status bar, simulating a card click:
                    // playableCardsIds.forEach(
                    //     cardId => this.addActionButton(`actPlayCard${cardId}-btn`, _('Play card with id ${card_id}').replace('${card_id}', cardId), () => this.onCardClick(cardId))
                    //); 

                    this.addActionButton('actPass-btn', _('Pass'), () => this.bgaPerformAction("actPass"), null, null, 'gray'); 
                    break;
                }
            }
        },        

        // How-to for buttons - this.addActionButton is deprecated
        // this.statusBar.addActionButton(label: string, callback: Function, params: object = { color: 'primary' }): HTMLButtonElement
        // Parameters:
        
        // label: the label to be shown, can be html. If label if used pass traslated string, i.e. _('Yes')
        // callback: function to call on click, cannot be method name it has to be function
        // params: object optionally containing one of more of the following:
        // color: can be primary (default) (blue), secondary (gray), alert (red)
        // id: is the dom element id to set. If null/undefined, the button will not have an id, but you can still manipulate it by storing the reference to the DOM Element returned by the function
        // classes: can be a string or an array, so 'disabled blinking' and ['disabled', 'blinking'] are both possible.
        // destination: the DOM Element to add the button to. If not specified, will add it to the status bar.
        // title: plain text description of the label. Should be set when the button label is an icon, for accessibility.
        //https://en.doc.boardgamearena.com/Game_interface_logic:_yourgamename.js?_gl=1*1dt80t1*_ga*OTUxNDIxMTYzLjE2OTY5ODQ4MTc.*_ga_DWXD9R5L7D*MTczNjgyODkzOS4yMjguMS4xNzM2ODMwNzY5LjYwLjAuMA..#Title_bar

        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
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
        
        onCardClick: function( card_id )
        {
            console.log( 'onCardClick', card_id );

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
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );
            
            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  
        
        // TODO: from this point and below, you can write your game notifications handling methods
        
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
   });             
});
