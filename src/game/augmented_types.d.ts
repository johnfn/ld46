import { Player } from "./player";
import { Overlay } from "./overlay";
import { GameMap } from "./game_map";

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
  }
}