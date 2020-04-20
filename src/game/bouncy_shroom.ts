import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Texture } from "pixi.js";
import { Rect } from "../library/geometry/rect";
import { Assets } from "./assets";
import { HoverText } from "./hover_text";
import { C } from "./constants";
import { Sfx } from "./sfx";
import { GameCoroutine } from "../library/coroutine_manager";

export class BouncyShroom extends Entity {
  public interactionDistance = C.InteractionDistance;
  public frames: Texture[];
  public interacted = false;

  hoverText: HoverText;

  constructor(
    tempTex: Texture // need better 1
  ) {
    super({ 
      name      : "BouncyShroom",
      texture   : Assets.getResource("mushroom1")[0],
      collidable: true,
    });

    this.frames = Assets.getResource("mushroom1");

    this.addChild(this.hoverText = new HoverText("x: interact"), 0, -80);
    this.hoverText.visible = false;
  }

  public collisionBounds(): Rect {
    return new Rect({
      x     : 0,
      y     : 0,
      width : 256,
      height: 256,
    })
  }

  update(state: IGameState) { 
    if (state.player.position.distance(this.position) < this.interactionDistance) {
      this.hoverText.visible = true;

      if (state.keys.justDown.X && !this.interacted && state.spiritUnused >= 1) {
        state.spiritUnused -= 1;
        this.interacted = true;
        state.sfx.useSpirit.play();
        this.startCoroutine("animateAlive", this.animateAlive())
      }
    } else {
      this.hoverText.visible = false;
    }
  }

  *animateAlive(): GameCoroutine {
    for (let i = 0; i < this.frames.length; i++) {
      this.texture = this.frames[i];

      yield { frames: 8 };
    }
  }
}