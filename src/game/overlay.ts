import { Entity } from "../library/entity";
import { Graphics } from "pixi.js";
import { C } from "./constants";

export class Overlay extends Entity {
  constructor() {
    super({
      name: "overlay",
    });

    const graphic = new Graphics();
    this.sprite.addChild(graphic);

    graphic.beginFill(0x000000);
    graphic.drawRect(0, 0, C.CanvasWidth * C.Scale, C.CanvasHeight * C.Scale);
    graphic.endFill();

    this.sprite.addChild(graphic);
  }
}