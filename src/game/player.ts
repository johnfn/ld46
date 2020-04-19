import { Game } from "./game";
import { GameMap } from "./game_map";
import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Texture } from "pixi.js";
import { C } from "./constants";
import { Rect } from "../library/geometry/rect";
import { Vine } from "./vine_flower";

export class Player extends Entity {
  speed = 10;
  jumpHeight = 20;

  idle: Texture[];
  walk: Texture[];
  jump: Texture[];
  
  animState: Texture[]

  frame = 0;
  facing: "left" | "right" = "right";

  constructor() {
    super({
      name   : "Player",
      texture: Assets.getResource("owo"),
    });

    this.idle = Assets.getResource("char_idle");
    this.scale = C.Scale;

    this.walk = Assets.getResource("char_walk");
    this.jump = Assets.getResource("char_jump");

    this.animState = this.idle;
    this.x = 200;
  }

  audio: HTMLAudioElement | null = null;

  get grounded() {
    return this.hitInfo.down
  }

  animate(state: IGameState) {
    if (state.tick % 8 === 0) {
      this.frame = (this.frame + 1) % this.animState.length;
    }
  }

  public collisionBounds(): Rect {
    return new Rect({
      x     : 50,
      y     : 50,
      width : 40,
      height: this.height - 80,
    })
  }

  update(state: IGameState): void {
    this.animate(state);

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

    const touchingVine = this.hitInfo.interactions.find(x => x.otherEntity instanceof Vine);

    if (touchingVine) {
      // Climb ladder

      this.velocity = this.velocity.addY(1);

      if (state.keys.down.W) {
        this.velocity = this.velocity.addY(-10);
      } 
      
      if (state.keys.down.S) {
        // This is the only way you can go down
        this.velocity = this.velocity.addY(10);
        this.velocity = this.velocity.clampY(-10, 10);
      } else {
        this.velocity = this.velocity.clampY(-10, 0);
      }
    } else {
      // gravity

      this.velocity = this.velocity.addY(1);
    }

    if (this.grounded) {
      if (this.velocity.x === 0) {
        this.animState = this.idle;
      }
    }
    
    if (state.keys.justDown.Spacebar && (this.hitInfo.down || (touchingVine && this.velocity.y <= 2))) {
      this.velocity = this.velocity.withY(-this.jumpHeight);
      this.animState = this.jump;
      this.frame = 0;
    }

    this.texture = this.animState[this.frame];
    
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