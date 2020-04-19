import { Player } from "./player";
import { Overlay } from "./overlay";
import { GameMap } from "./game_map";
import { Camera } from "../library/camera";
import { Cinematics } from "/Users/johnfn/code/ld46/src/game/cinematics";

declare module "Library" {
  export interface ModeList {
    Dialog: never;
  }

  export interface IGameState {
    player       : Player;
    overlay      : Overlay;
    spiritTotal  : number;
    spiritUnused : number;
    map          : GameMap;
    camera       : Camera;
    cinematics   : Cinematics;
  }
}