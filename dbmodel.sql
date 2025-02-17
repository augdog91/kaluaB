
-- ------
-- BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
-- kaluab implementation : © <Your name here> <Your email address here>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----

-- dbmodel.sql

-- This is the file where you are describing the database schema of your game
-- Basically, you just have to export from PhpMyAdmin your table structure and copy/paste
-- this export here.
-- Note that the database itself and the standard tables ("global", "stats", "gamelog" and "player") are
-- already created and must not be created here

-- Note: The database schema is created from this file when the game starts. If you modify this file,
--       you have to restart a game to see your changes in database.

-- Create a "card" table to be used with the "Deck" tools:
-- card_type (global/local/bonus) 21 Bonus, 19 Local Disaster, 10 Global Disaster
-- card_type_arg(1,2,3)
-- card_location (deck, p1, p2, p3, p4, p5)
-- card_location_arg (0-5)

CREATE TABLE IF NOT EXISTS `disaster_card` (
  `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `card_type` varchar(16) NOT NULL,
  `card_type_arg` int(11) NOT NULL,
  `card_location` varchar(16) NOT NULL,
  `card_location_arg` int(11) NOT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- CREATE TABLE IF NOT EXISTS `bonus_card` (
--   `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
--   `card_type` varchar(16) NOT NULL,
--   `card_type_arg` int(11) NOT NULL,
--   `card_location` varchar(16) NOT NULL,
--   `card_location_arg` int(11) NOT NULL,
--   PRIMARY KEY (`card_id`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- CREATE TABLE IF NOT EXISTS `hktoken` (
--   `hktoken_key` varchar(32) NOT NULL,
--   `hktoken_location` varchar(32) NOT NULL,
--   `hktoken_state` int(10),
--   PRIMARY KEY (`hktoken_key`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- -- add a custom field to the standard "player" table
-- prayer cost
-- effects:

-- -- ALTER TABLE `player` ADD `player_my_custom_field` INT UNSIGNED NOT NULL DEFAULT '0';

