import { Game } from "./game";
import { GameMap } from "./game_map";
import { Vector2 } from "../library/geometry/vector2";
import { Assets } from "./assets";
import { GameState } from "./state";
import { Entity } from "../library/entity";

export class Player extends Entity {
  speed = 25;

  constructor() {
    super({
      name   : "Player",
      texture: Assets.getResource("owo"),
    });

    this.scale = new Vector2({ x: 4, y: 4 });
  }

  audio: HTMLAudioElement | null = null;

  update(state: GameState): void {
    this.velocity = this.velocity.withX(0);

    if (this.hitInfo.down) {
      this.velocity = this.velocity.withY(0);
    }

    if (state.keys.down.A) {
      this.velocity = this.velocity.addX(-this.speed);
    }

    if (state.keys.down.D) {
      this.velocity = this.velocity.addX(this.speed);
    }

    this.velocity = this.velocity.addY(1);

    if (state.keys.justDown.Spacebar) {
      this.velocity = this.velocity.withY(-30);
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