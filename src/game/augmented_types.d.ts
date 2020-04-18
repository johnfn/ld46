import { Player } from "./player";

declare module "Library" {
  export interface ModeList {
    Dialog: never;
  }

  export interface IGameState {
    player: Player;
  }
}