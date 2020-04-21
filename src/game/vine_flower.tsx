import { Texture } from "pixi.js";
import { Entity } from "../library/entity";
import { C } from "./constants";
import { IGameState } from "Library";
import { HoverText } from "./hover_text";
import { Assets } from "./assets";
import { GameCoroutine } from "../library/coroutine_manager";
import { Rect } from "../library/geometry/rect";
import { Vector2 } from "../library/geometry/vector2";
import { Sfx } from "./sfx";
import { GabbysGlowThing } from "./gabbys_glow_thing";

class VineComponent extends Entity {
  public frame = 0;
  private frames = Assets.getResource("vine_live");

  constructor() {
    super({ name: "VineComponent" });
  }

  setFrame(frame: number) {
    this.texture = this.frames[frame];
    this.frame = frame;
  }
}

export class Vine extends Entity {
  finishedVineComponents: VineComponent[] = [];
  parentFlower: VineFlower;
  isActivated = false;

  constructor(parentFlower: VineFlower) {
    super({
      name        : "Vine",
      texture     : Assets.getResource("vine_live")[0],
      interactable: true,
    });

    this.parentFlower = parentFlower;
  }

  deadFrame = 4;
  aliveFrame = 7;

  *growVine(): GameCoroutine {
    let state = yield "next";

    this.visible = true;
    this.isActivated = true;

    for (let i = 1; true; i++) {
      const ent = new VineComponent();
      ent.setFrame(0);

      const nextPosition = new Vector2(
        (ent.width / 2),
        (ent.height / 2 + this.y - ent.height * i)
      ).add(this.positionAbsolute());

      // Are we about to hit a wall?
      if (state.lastCollisionGrid.collidesPoint(nextPosition).length > 0) {
        break;
      }

      this.addChild(ent, 0, this.y - ent.height * i);

      for (let frame = 0; frame < this.deadFrame; frame++) {
        ent.setFrame(frame);

        state = yield { frames: 1 };
      }

      this.finishedVineComponents.push(ent);
    }

    if (state.haveVinePerma) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      const state = yield { frames: 60 };
      state.sfx.tickSound.currentTime = 0;
      state.sfx.tickSound.play();
    }

    this.parentFlower.texture = this.parentFlower.frames[this.parentFlower.frames.length - 2];

    for (let i = 0; i < 4 * 2; i++) {
      const state = yield { frames: 30 };
      state.sfx.tickSound.currentTime = 0;
      state.sfx.tickSound.play();
    }

    this.parentFlower.texture = this.parentFlower.frames[this.parentFlower.frames.length - 3];

    for (let i = 0; i < 4 * 4; i++) {
      const state = yield { frames: 15 };
      state.sfx.tickSound.currentTime = 0;
      state.sfx.tickSound.play();
    }

    state = yield "next";

    state.sfx.tickSound2.play();

    for (let i = 0; i < this.finishedVineComponents.length; i++) {
      const comp = this.finishedVineComponents[i];

      comp.parent?.removeChild(comp);
      comp.destroy(state);

      yield { frames: 8 };
    }

    this.finishedVineComponents = [];

    yield* this.parentFlower.die()

    this.parentFlower.interacted = false;
  }

  update(state: IGameState) {
    if (state.tick % 8 !== 0) return;

    for (const vine of this.finishedVineComponents) {
      if (state.player.positionAbsolute().distance(vine.positionAbsolute()) < 600) {
        if (vine.frame < this.aliveFrame) {
          vine.setFrame(vine.frame + 1);
        }
      } else {
        if (vine.frame > this.deadFrame) {
          vine.setFrame(vine.frame - 1);
        }
      }
    }
  }

  public collisionBounds(): Rect {
    if (this.visible) {
      const height = (this.finishedVineComponents.length * 256);

      // tiny offsets make vine climbing more forgiving
      return new Rect({
        x     : -this.width*(1/14),
        y     : -height,
        width : this.width*(7/6),
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
  interactionDistance = C.InteractionDistance;
  frame = 0;
  hoverText: HoverText;
  interacted = false;

  vine: Vine;
  frames: Texture[];

  constructor(tex: Texture) {
    super({
      name   : "VineFlower",
      texture: Assets.getResource("vine_flower_live")[0],
    });

    this.frames = Assets.getResource("vine_flower_live");

    this.addChild(this.hoverText = new HoverText("x: interact"), 0, -80);
    this.hoverText.visible = false;

    this.addChild(this.vine = new Vine(this));

    this.vine.sprite.anchor.set(0, 1); // grow upwards
    this.vine.height = 256;
    this.vine.visible = false;

    this.addChild(new GabbysGlowThing(0x3c6ad1));
  }

  *animateAlive(): GameCoroutine {
    for (let i = 0; i < this.frames.length; i++) {
      this.texture = this.frames[i];

      yield { frames: 8 };
    }
  }

  *die(): GameCoroutine {
    for (let i = 0; i < this.frames.length; i++) {
      this.texture = this.frames[this.frames.length - i - 1];

      yield { frames: 8 };
    }
  }

  update(state: IGameState) {
    if (state.player.position.distance(this.position) < this.interactionDistance) {
      this.hoverText.visible = true;

      if (state.keys.justDown.X && !this.interacted && state.spiritUnused >= 1) {
        state.spiritUnused -= 1;

        this.interacted = true;

        state.sfx.useSpirit.play();

        this.startCoroutine(`animateAlive-${ this.id }`, this.animateAlive())
        this.startCoroutine(`growVine-${ this.id }`, this.vine.growVine());
      }
    } else {
      this.hoverText.visible = false;
    }
  }
}