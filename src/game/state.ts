import { BaseGameState } from "../library/base_state";
import { Player } from "./player";
import { IGameState, Mode } from "Library";
import { Overlay } from "./overlay";
import { GameMap } from "./game_map";

export class GameState extends BaseGameState implements IGameState {
  mode          : Mode = "Normal";
  player       !: Player;
  overlay      !: Overlay;
  tick         = 0;
  spiritTotal  = 3;
  spiritUnused = 3;
  map         !: GameMap;
}