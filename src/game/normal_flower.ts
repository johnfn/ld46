import { Texture } from "pixi.js";

import { Vector2 } from "../library/geometry/vector2";
import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { GameCoroutine } from "../library/coroutine_manager";

let flowers = 0;

export class NormalFlower extends Entity {
  interactionDistance = 500;
  frame = 0;
  frames: Texture[];

  constructor() {
    super({
      name   : "Flower",
      texture: Assets.getResource("flower_live")[0],
    });

    this.frames = Assets.getResource("flower_live");
    this.scale = new Vector2({ x: 1, y: 1 });

    this.startCoroutine(`flower-update-${ ++flowers }`, this.flowerUpdate());
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