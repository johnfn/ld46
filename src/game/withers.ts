import { Entity } from "../library/entity";
import { Assets } from "./assets";
import { IGameState } from "Library";
import { Texture } from "pixi.js";

export class Withers extends Entity {
  public static Instance: Withers;

  frames: Texture[];

  constructor() {
    super({
      name: "Bud",
      texture: Assets.getResource("withers/withers_idle")[0],
    });

    this.frames = Assets.getResource("withers/withers_idle");

    Withers.Instance = this;
  }

  /*
  
  update(state: IGameState) {
    this.texture = this.frames[Math.floor(state.tick / 8) % this.frames.length];

    this.x = state.player.x - 2000;
    this.y = state.player.y - 2000;
  }

  */
}
