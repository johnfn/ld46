import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { C } from "./constants";
import { Texture } from "pixi.js";
import { Assets } from "./assets";

export class Fountain extends Entity {
  rechargeRate = 60;
  interactionDistance = C.InteractionDistance;

  frames: Texture[];
  graphic: Entity;

  constructor() {
    super({ 
      name: "Fountain",
    });

    this.addChild(
      this.graphic = new Entity({
        texture: Assets.getResource("fountain")[0],
        name: "FountainGraphic"
      }),
      0, -256
    );

    this.frames = Assets.getResource("fountain");
  }

  update(state: IGameState) {
    this.graphic.texture = this.frames[Math.floor(state.tick / 8) % this.frames.length];

    if (state.tick % this.rechargeRate !== 0) { return; }

    if (this.distance(state.player) < this.interactionDistance) {
      // Animation?

      state.spiritUnused = Math.min(state.spiritUnused + 1, state.spiritTotal);
    }
  }
}