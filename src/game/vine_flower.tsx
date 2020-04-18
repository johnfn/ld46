import { Texture } from "pixi.js";
import { Entity } from "../library/entity";
import { C } from "./constants";
import { IGameState } from "Library";
import { HoverText } from "./hover_text";
import { Assets } from "./assets";
import { GameCoroutine } from "../library/coroutine_manager";

export class VineFlower extends Entity {
  interactionDistance = 200;
  frame = 0;
  hoverText: HoverText;
  interacted = false;

  vine: Entity;

  constructor(tex: Texture) {
    super({
      name   : "VineFlower",
      texture: tex,
    });

    this.scale = C.Scale;
    this.addChild(this.hoverText = new HoverText("x: interact"), 0, -80);
    this.hoverText.visible = false;

    this.addChild(this.vine = new Entity({ name: "Vine", texture: Assets.getResource("vine_live")[0] }), 0, 0);

    this.vine.sprite.anchor.set(0, 1); // grow upwards
    this.vine.height = 256;
    this.vine.visible = false;
  }

  *growVine(): GameCoroutine {
    this.vine.visible = true;

    while (this.vine.height < 2000) {
      this.vine.height += 10;

      yield "next";
    }
  }

  update(state: IGameState) {
    if (state.player.position.distance(this.position) < this.interactionDistance) {
      this.scale = C.Scale.multiply(1.2);
      this.hoverText.visible = true;

      if (state.keys.justDown.X && !this.interacted) {
        this.interacted = true;
        this.startCoroutine("growVine", this.growVine());
      }
    } else {
      this.scale = C.Scale;
      this.hoverText.visible = false;
    }
  }
}