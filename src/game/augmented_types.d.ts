import { Player } from "./player";
import { Overlay } from "./overlay";

declare module "Library" {
  export interface ModeList {
    Dialog: never;
  }

  export interface IGameState {
    player : Player;
    overlay: Overlay;
  }
}