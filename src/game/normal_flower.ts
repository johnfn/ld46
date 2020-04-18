import { Vector2 } from "../library/geometry/vector2";
import { Assets } from "./assets";
import { Entity } from "../library/entity";

export class NormalFlower extends Entity {
  constructor() {
    super({
      name   : "Flower",
      texture: Assets.getResource("flower_live")[0],
    });

    console.log(Assets.getResource("flower_live"));

    this.scale = new Vector2({ x: 4, y: 4 });
  }
}