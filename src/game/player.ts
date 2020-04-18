import { Game } from "./game";
import { GameMap } from "./game_map";
import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Texture } from "pixi.js";
import { C } from "./constants";

export class Player extends Entity {
  speed = 10;
  jumpHeight = 20;

  idle: Texture[];
  frame = 0;

  constructor() {
    super({
      name   : "Player",
      texture: Assets.getResource("owo"),
    });

    this.idle = Assets.getResource("char_idle");

    this.scale = C.Scale;
  }

  audio: HTMLAudioElement | null = null;

  update(state: IGameState): void {
    if (state.tick % 8 === 0) {
      this.frame = (this.frame + 1) % this.idle.length;
    }

    this.texture = this.idle[this.frame];

    this.velocity = this.velocity.withX(0);

    if (this.hitInfo.down || this.hitInfo.up) {
      this.velocity = this.velocity.withY(0);
    }

    if (state.keys.down.A) {
      this.velocity = this.velocity.addX(-this.speed);
    }

    if (state.keys.down.D) {
      this.velocity = this.velocity.addX(this.speed);
    }

    this.velocity = this.velocity.addY(1);

    if (state.keys.justDown.Spacebar && this.hitInfo.down) {
      this.velocity = this.velocity.withY(-this.jumpHeight);
    }

    Game.Instance.camera.centerOn(this.position);

    for (const region of GameMap.Instance.musicRegions) {
      if (region.rect.contains(this.position)) {
        const songPath = region.properties["file"];

        if (!this.audio || this.audio.src !== songPath) {
          this.audio = new Audio(songPath);
        }
      }
    }
  }
}