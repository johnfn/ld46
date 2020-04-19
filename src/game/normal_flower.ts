import { Texture } from "pixi.js";

import { Assets, AssetsToLoad } from "./assets";
import { Entity } from "../library/entity";
import { GameCoroutine } from "../library/coroutine_manager";
import { C } from "./constants";

let flowers = 0;

let flowersMap: {[key: number]: keyof typeof AssetsToLoad} = {1: "flower1", 2: "flower2", 3: "flower3"}

export class NormalFlower extends Entity {
  interactionDistance = C.InteractionDistance;
  frame = 0;
  frames: Texture[];

  constructor() {
    super({
      name   : "Flower",
      texture: Assets.getResource("flower1")[0],
    });

    this.frames = Assets.getResource(flowersMap[Math.floor(Math.random()*Object.keys(flowersMap).length) + 1]) as Texture[];
    if (Math.random() > 0.5) this.sprite.scale.x *= -1;

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