import { Player } from "./player";
import { Overlay } from "./overlay";
import { GameMap } from "./game_map";
import { Camera } from "../library/camera";
import { Cinematics } from "/Users/johnfn/code/ld46/src/game/cinematics";
import { Sfx } from "./sfx";

declare module "Library" {
  export interface ModeList {
    Dialog: never;
    Menu: never;
  }

  export interface IGameState {
    player       : Player;
    sfx          : Sfx;
    haveVinePerma : boolean;
    haveShroomPerma: boolean;

    /**
     * Is Bud following the player
     */
    budFollowing : boolean;
    overlay      : Overlay;
    spiritTotal  : number;
    spiritUnused : number;
    map          : GameMap;
    camera       : Camera;
    cinematics   : Cinematics;
  }
}