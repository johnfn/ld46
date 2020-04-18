import { Texture } from "pixi.js";
import { Entity } from "../library/entity";
import { C } from "./constants";
import { IGameState } from "Library";
import { HoverText } from "./hover_text";

export class VineFlower extends Entity {
  interactionDistance = 200;
  frame = 0;
  hoverText: HoverText;

  constructor(tex: Texture) {
    super({
      name   : "VineFlower",
      texture: tex,
    });

    this.scale = C.Scale;
    this.addChild(this.hoverText = new HoverText("x: interact"), 0, -80);
    this.hoverText.visible = false;
  }

  update(state: IGameState) {
    if (state.player.position.distance(this.position) < this.interactionDistance) {
      this.scale = C.Scale.multiply(1.2);
      this.hoverText.visible = true;
    } else {
      this.scale = C.Scale;
      this.hoverText.visible = false;
    }
  }
}