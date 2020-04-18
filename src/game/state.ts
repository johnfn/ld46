import { BaseGameState } from "../library/base_state";
import { Player } from "./player";
import { IGameState, Mode } from "Library";

export class GameState extends BaseGameState implements IGameState {
  mode   : Mode = "Normal";
  player!: Player;
}