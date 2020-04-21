import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { C } from "./constants";
import { Texture } from "pixi.js";
import { Assets } from "./assets";
import { Mode } from "Library";

export class Fountain extends Entity {
  activeModes: Mode[] = ["Normal", "Dialog"];

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
      0, -this.graphic.height + 256
    );

    this.frames = Assets.getResource("fountain");
  }

  update(state: IGameState) {
    this.graphic.texture = this.frames[Math.floor(state.tick / 8) % this.frames.length];

    if (state.tick % this.rechargeRate !== 0) { return; }

    if (this.distance(state.player) < this.interactionDistance) {
      // Animation?

      if (state.spiritUnused < state.spiritTotal) {
        Assets.getResource("sound effects/refill spirit").play();
      }

      state.spiritUnused = Math.min(state.spiritUnused + 1, state.spiritTotal);
    }
  }
}