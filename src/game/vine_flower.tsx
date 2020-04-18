import { Texture } from "pixi.js";

import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { C } from "./constants";
import { IGameState } from "Library";

export class VineFlower extends Entity {
  interactionDistance = 800;
  frame = 0;

  constructor(tex: Texture) {
    super({
      name   : "VineFlower",
      texture: tex,
    });

    this.scale = C.Scale;
  }

  update(state: IGameState) {
    if (state.player.position.distance(this.position) < this.interactionDistance) {
      this.scale = C.Scale.multiply(1.2);
    } else {
      this.scale = C.Scale;
    }
  }
}