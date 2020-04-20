import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Texture } from "pixi.js";
import { Rect } from "../library/geometry/rect";
import { Assets } from "./assets";
import { HoverText } from "./hover_text";
import { C } from "./constants";
import { GameCoroutine } from "../library/coroutine_manager";
import { GabbysGlowThing } from "./gabbys_glow_thing";

export class BouncyShroom extends Entity {
  public interactionDistance = C.InteractionDistance;
  public frames: Texture[];
  public isActivated = false;

  hoverText: HoverText;

  constructor() {
    super({ 
      name      : "BouncyShroom",
      texture   : Assets.getResource("mushroom1")[0],
      collidable: true,
    });

    this.frames = Assets.getResource("mushroom1");

    this.addChild(this.hoverText = new HoverText("x: interact"), 0, -80);
    this.hoverText.visible = false;

    this.addChild(new GabbysGlowThing(0x3cda61));
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

      if (state.keys.justDown.X && !this.isActivated && state.spiritUnused >= 1) {
        state.spiritUnused -= 1;
        this.isActivated = true;
        state.sfx.useSpirit.play();
        this.startCoroutine("animateAlive", this.animateAliveThenDie());
      }
    } else {
      this.hoverText.visible = false;
    }
  }

  *animateAliveThenDie(): GameCoroutine {
    for (let i = 0; i < this.frames.length; i++) {
      this.texture = this.frames[i];

      yield { frames: 8 };
    }

    let state = yield "next";

    if (state.haveShroomPerma) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      state = yield { frames: 60 };
      state.sfx.tickSound.currentTime = 0;
      state.sfx.tickSound.play();
    }

    this.texture = this.frames[this.frames.length - 2];

    for (let i = 0; i < 4 * 2; i++) {
      state = yield { frames: 30 };
      state.sfx.tickSound.currentTime = 0;
      state.sfx.tickSound.play();
    }

    this.texture = this.frames[this.frames.length - 3];

    for (let i = 0; i < 4 * 4; i++) {
      state = yield { frames: 15 };
      state.sfx.tickSound.currentTime = 0;
      state.sfx.tickSound.play();
    }

    state = yield "next";

    state.sfx.tickSound2.play();

    for (let i = 2; i < this.frames.length; i++) {
      this.texture = this.frames[this.frames.length - i - 1];

      yield { frames: 8 };
    }

    this.isActivated = false;
  }
}