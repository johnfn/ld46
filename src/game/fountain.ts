import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { C } from "./constants";
import { Texture } from "pixi.js";

export class Fountain extends Entity {
  rechargeRate = 60;
  interactionDistance = C.InteractionDistance;

  constructor(
    tempTex: Texture // need better 1
  ) {
    super({ 
      name: "Fountain",
      texture: tempTex,
    });
  }

  update(state: IGameState) {
    if (state.tick % this.rechargeRate !== 0) { return; }

    if (this.distance(state.player) < this.interactionDistance) {
      // Animation?

      state.spiritUnused = Math.min(state.spiritUnused + 1, state.spiritTotal);
    }
  }
}