import { Texture } from "pixi.js";
import { Entity } from "../library/entity";
import { C } from "./constants";
import { IGameState } from "Library";
import { HoverText } from "./hover_text";
import { Assets } from "./assets";
import { GameCoroutine } from "../library/coroutine_manager";
import { Rect } from "../library/geometry/rect";

export class Vine extends Entity {
  vineComponents: Entity[] = [];

  constructor() {
    super({
      name        : "Vine",
      texture     : Assets.getResource("vine_live")[0],
      interactable: true,
    });
  }

  *growVine(): GameCoroutine {
    let frames = Assets.getResource("vine_live");
    this.visible = true;

    for (let i = 1; i < 10; i++) {
      const ent = new Entity({ texture: frames[0], name: "VineComponent" });

      this.addChild(ent, 0, this.y - ent.height * i);

      for (let frame = 0; frame < frames.length; frame++) {
        ent.texture = frames[frame];

        yield { frames: 4 };
      }

      this.vineComponents.push(ent);
    }
  }

  public collisionBounds(): Rect {
    if (this.visible) {
      const height = (this.vineComponents.length * 256) * C.Scale.y;

      return new Rect({
        x     : 0,
        y     : -height,
        width : this.width   * C.Scale.x,
        height: height,
      });
    } else {
      return new Rect({
        x: 0, 
        y: 0,
        width: 0,
        height: 0
      });
    }
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

      if (state.keys.justDown.X && !this.interacted && state.spiritUnused >= 1) {
        state.spiritUnused -= 1;

        this.interacted = true;
        this.startCoroutine("growVine", this.vine.growVine());
      }
    } else {
      this.hoverText.visible = false;
    }
  }
}