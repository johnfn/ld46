import { Texture } from "pixi.js";

import { Assets, AssetsToLoad } from "./assets";
import { Entity } from "../library/entity";
import { GameCoroutine } from "../library/coroutine_manager";
import { C } from "./constants";
import { Vector2 } from "../library/geometry/vector2";

let flowers = 0;

let flowersMap: {[key: number]: keyof typeof AssetsToLoad} = {
  1: "flower1",
  2: "flower2",
  3: "flower3",
  4: "grass1",
  5: "shroom1",
  6: "shroom2",
}

let flowersRate: {[key: number]: string[]} = {
  0: ["flower3"], //Sanctuary level
  1: ["grass1"], //Vine level
  2: ["shroom1", "shroom1"], //Mushroom level
  3: ["flower1", "flower2", "flower3", "grass1"]  //Tree level
}

export class NormalFlower extends Entity {
  interactionDistance = C.InteractionDistance;
  frame = 0;
  frames: Texture[];

  constructor(position: Vector2, level?: number) {
    super({
      name   : "Flower",
      texture: Assets.getResource("flower1")[0],
    });

    if (level != undefined && level in flowersRate) {
      let flowers = flowersRate[level];
      let r = Math.floor(Math.random()*flowers.length);
      this.frames = Assets.getResource(flowers[r] as keyof typeof AssetsToLoad) as Texture[];
    } else {
      this.frames = Assets.getResource(flowersMap[Math.floor(Math.random()*Object.keys(flowersMap).length) + 1]) as Texture[];
    }

    this.sprite.anchor.set(0.5, 0);

    // Vary flowers size/rotation
    if (Math.random() > 0.5) this.sprite.scale.x *= -1;
    let r = Math.random() + 0.5;
    this.sprite.scale.set(r);
    this.position = position.addY(256*(1-r));
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