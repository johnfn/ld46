import { Entity } from "../library/entity";import { C } from "./constants";import { Texture } from "pixi.js";import { HoverText } from "./hover_text";import { Assets } from "./assets";import { Rect } from "../library/geometry/rect";import { IGameState } from "Library";import { GameCoroutine } from "../library/coroutine_manager";

export class Wisteria extends Entity {
  public interactionDistance = C.InteractionDistance;
  public frames: Texture[];
  public interacted = false;

  hoverText: HoverText;
  graphic: Entity;

  constructor() {
    super({ 
      name      : "Wisteria",
    });

    this.graphic = new Entity({
      name: "WistGraphic",
      texture: Assets.getResource("wisteria")[0],
    });
    this.addChild(this.graphic, 0, -Assets.getResource("wisteria")[0].height + 256)

    this.frames = Assets.getResource("wisteria");

    this.addChild(this.hoverText = new HoverText("x: interact"), 400, -900);
    this.hoverText.visible = false;
  }

  update(state: IGameState) { 
    if (state.player.position.distance(this.position) < this.interactionDistance) {
      this.hoverText.visible = true;

      if (state.keys.justDown.X && !this.interacted) {
        this.interacted = true;
        state.sfx.useSpirit.play();
        this.startCoroutine("animateAlive", this.animateAlive());
      } else {
        this.startCoroutine("wisttalk", state.cinematics.wisteria());
      }
    } else {
      this.hoverText.visible = false;
    }
  }

  *animateAlive(): GameCoroutine {
    for (let i = 0; i < this.frames.length; i++) {
      this.graphic.texture = this.frames[i];

      yield { frames: 8 };
    }

    let state = yield "next";

    state.spiritTotal += 1;
    state.spiritUnused = state.spiritTotal;
    state.haveVinePerma = true;

  }
}