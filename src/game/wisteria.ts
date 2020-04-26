import { Entity } from "../library/entity";import { C } from "./constants";import { Texture } from "pixi.js";import { HoverText } from "./hover_text";import { Assets } from "./assets";import { Rect } from "../library/geometry/rect";import { IGameState } from "Library";import { GameCoroutine } from "../library/coroutine_manager";
import { Vector2 } from "../library/geometry/vector2";

export class Wisteria extends Entity {
  public interactionDistance = C.InteractionDistance;
  public frames: Texture[];
  public interacted = false;

  hoverText: HoverText;
  graphic: Entity;
  maxScale: number = 1;

  constructor() {
    super({ 
      name      : "Wisteria",
    });

    this.graphic = new Entity({
      name: "WistGraphic",
      texture: Assets.getResource("wisteria")[0],
    });
    this.addChild(this.graphic, 0, 256)
    this.graphic.sprite.anchor.set(0.5, 1);
    this.graphic.scale = new Vector2(1.5, 1.5)
    this.maxScale = 3 - 1.5;

    this.frames = Assets.getResource("wisteria");

    this.addChild(this.hoverText = new HoverText("x: interact"), 400, -900);
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
          this.startCoroutine("animateAliveWisteria", this.animateAlive());

          setTimeout(() => {
            this.interacting = false;
          }, 20000);
        } else {
          this.startCoroutine("wisttalk", state.cinematics.wisteria());
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

    let state = yield "next";
    state.spiritTotal += 1;
    state.spiritUnused = state.spiritTotal;
    state.haveVinePerma = true;
    yield { frames: 100 };

    yield* state.cinematics.wisteria();

  }
}