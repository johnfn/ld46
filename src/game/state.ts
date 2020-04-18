import { BaseGameState } from "../library/base_state";
import { Player } from "./player";
import { IGameState, Mode } from "Library";
import { Overlay } from "./overlay";

export class GameState extends BaseGameState implements IGameState {
  mode    : Mode = "Normal";
  player !: Player;
  overlay!: Overlay;
  tick   = 0;
}