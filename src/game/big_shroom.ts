import { Entity } from "../library/entity";
import { C } from "./constants";
import { Texture } from "pixi.js";
import { HoverText } from "./hover_text";
import { Assets } from "./assets";
import { IGameState } from "Library";
import { GameCoroutine } from "../library/coroutine_manager";
import { Vector2 } from "../library/geometry/vector2";

export class BigShroom extends Entity {
  public interactionDistance = C.InteractionDistance;
  public frames: Texture[];
  public interacted = false;

  hoverText: HoverText;
  graphic: Entity;
  maxScale: number = 1;

  constructor() {
    super({ 
      name: "BigShroom",
    });

    this.graphic = new Entity({
      name: "BigShroomGraphic",
      texture: Assets.getResource("bigshroom")[0],
    });
    this.addChild(this.graphic, 0, 256)
    this.graphic.sprite.anchor.set(0.5, 1);
    this.maxScale = 2.5;

    this.frames = Assets.getResource("bigshroom");

    this.addChild(this.hoverText = new HoverText("x: interact"), -this.graphic.width/2, 0);
    this.hoverText.visible = false;
  }

  interacting = false;

  update(state: IGameState) { 
    if (this.interacting) { return; }

    if (state.player.position.distance(this.position) < this.interactionDistance) {
      this.hoverText.visible = true;

      if (state.keys.justDown.X) {
        if (!this.interacted) {
          this.interacting = true;
          this.interacted = true;
          state.sfx.useSpirit.play();

          setTimeout(() => {
            this.interacting = false;
          }, 20000);

          this.startCoroutine("animateAliveBigShroom", this.animateAlive());
        } else {
          this.startCoroutine("shroomtalk", state.cinematics.bigMush());
        }
      }
    } else {
      this.hoverText.visible = false;
    }
  }

  *animateAlive(): GameCoroutine {
    for (let i = 0; i < this.frames.length; i++) {
      this.graphic.texture = this.frames[i];
      this.graphic.scale = this.graphic.scale.add({x: this.maxScale/this.frames.length, y: this.maxScale/this.frames.length})

      yield { frames: 8 };
    }

    const state = yield "next";

    state.spiritTotal += 1;
    state.spiritUnused = state.spiritTotal;
    state.haveShroomPerma = true;

    this.interacted = true;

    yield { frames: 100 };

    yield* state.cinematics.bigMush();
  }
}