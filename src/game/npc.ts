import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Texture } from "pixi.js";
import { Rect } from "../library/geometry/rect";

export class Npc extends Entity {
  constructor(
    tempTex: Texture // need better 1
  ) {
    super({ 
      name      : "Npc",
      texture   : tempTex,
      collidable: true,
    });
  }

  public collisionBounds(): Rect {
    return new Rect({
      x     : 0,
      y     : 0,
      width : 256,
      height: 256,
    })
  }

  update(state: IGameState) { }
}