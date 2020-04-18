import { Texture } from "pixi.js";

import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { GameCoroutine } from "../library/coroutine_manager";
import { Vector2 } from "../library/geometry/vector2";
import { C } from "./constants";

let flowers = 0;

export class NormalFlower extends Entity {
  interactionDistance = 800;
  frame = 0;
  frames: Texture[];

  constructor() {
    super({
      name   : "Flower",
      texture: Assets.getResource("flower_live")[0],
    });

    this.frames = Assets.getResource("flower_live");

    this.startCoroutine(`flower-update-${ ++flowers }`, this.flowerUpdate());

    this.scale = C.Scale;
  }

  *flowerUpdate(): GameCoroutine {
    while (true) {
      const state = yield { frames: 10 };

      if (state.player.position.distance(this.position) < this.interactionDistance) {
        this.frame = Math.min(this.frames.length - 1, this.frame + 1);
      } else {
        this.frame = Math.max(0, this.frame - 1);
      }

      this.texture = this.frames[this.frame];
    }
  }
}