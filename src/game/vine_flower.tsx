import { Texture } from "pixi.js";
import { Entity } from "../library/entity";
import { C } from "./constants";
import { IGameState } from "Library";
import { HoverText } from "./hover_text";
import { Assets } from "./assets";
import { GameCoroutine } from "../library/coroutine_manager";
import { Rect } from "../library/geometry/rect";

class Vine extends Entity {
  constructor() {
    super({
      name      : "Vine",
      texture   : Assets.getResource("vine_live")[0],
      collidable: true,
    });
  }

  *growVine(): GameCoroutine {
    this.visible = true;

    while (this.height < 2000) {
      this.height += 10;

      yield "next";
    }
  }

  public collisionBounds(): Rect {
    return new Rect({
      x     : 0,
      y     : -this.height,
      width : this.width,
      height: this.height,
    });
  }
}

export class VineFlower extends Entity {
  interactionDistance = 200;
  frame = 0;
  hoverText: HoverText;
  interacted = false;

  vine: Vine;

  constructor(tex: Texture) {
    super({
      name   : "VineFlower",
      texture: tex,
    });

    this.scale = C.Scale;
    this.addChild(this.hoverText = new HoverText("x: interact"), 0, -80);
    this.hoverText.visible = false;

    this.addChild(this.vine = new Vine());

    this.vine.sprite.anchor.set(0, 1); // grow upwards
    this.vine.height = 256;
    this.vine.visible = false;
  }

  update(state: IGameState) {
    if (state.player.position.distance(this.position) < this.interactionDistance) {
      this.hoverText.visible = true;

      if (state.keys.justDown.X && !this.interacted) {
        this.interacted = true;
        this.startCoroutine("growVine", this.vine.growVine());
      }
    } else {
      this.hoverText.visible = false;
    }
  }
}