import { Game } from "./game";
import { GameMap } from "./game_map";
import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Texture } from "pixi.js";
import { Rect } from "../library/geometry/rect";
import { Vine } from "./vine_flower";
import { Vector2 } from "../library/geometry/vector2";

export class Player extends Entity {
  speed = 30;
  jumpHeight = 50;
  gravity = 2;

  idle: Texture[];
  walk: Texture[];
  jump: Texture[];
  
  animState: Texture[]

  frame = 0;
  facing: "left" | "right" = "right";
  climbSpeed = 20;

  constructor() {
    super({
      name   : "Player",
      texture: Assets.getResource("owo"),
    });

    this.idle = Assets.getResource("char_idle");

    this.walk = Assets.getResource("char_walk");
    this.jump = Assets.getResource("char_jump");

    this.animState = this.idle;
    this.x = 300;
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
      x     : 200,
      y     : 20,
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

      this.velocity = this.velocity.addY(this.gravity);

      if (state.keys.down.W) {
        this.velocity = this.velocity.addY(-this.climbSpeed);
      } 
      
      if (state.keys.down.S) {
        // This is the only way you can go down
        this.velocity = this.velocity.addY(this.climbSpeed);
        this.velocity = this.velocity.clampY(-this.climbSpeed, this.climbSpeed);
      } else {
        this.velocity = this.velocity.clampY(-this.climbSpeed, 0);
      }
    } else {
      // gravity

      this.velocity = this.velocity.addY(this.gravity);
    }

    if (this.grounded) {
      if (this.velocity.x === 0) {
        this.animState = this.idle;
      }
    }
    
    if (state.keys.justDown.Spacebar && (this.hitInfo.down || (touchingVine && this.velocity.y <= 2))) {
      this.velocity = this.velocity.withY(-this.jumpHeight);
      this.animState = this.jump;
    }

    this.texture = this.animState[this.frame];
    
    Game.Instance.camera.centerOn(this.position.add(new Vector2(0, -400)));

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