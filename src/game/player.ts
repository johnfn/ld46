import { Game } from "./game";
import { GameMap } from "./game_map";
import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Texture, Sprite, BLEND_MODES } from "pixi.js";
import { Rect } from "../library/geometry/rect";
import { Vine } from "./vine_flower";
import { Vector2 } from "../library/geometry/vector2";

export class Player extends Entity {
  speed      = 30;
  jumpHeight = 50;
  gravity    = 2;
  colliderSize = new Vector2(100, 550);

  static StartPosition = new Vector2(300, 300);

  idle:  Texture[];
  walk:  Texture[];
  jump:  Texture[];
  climb: Texture[];

  glowOverlay: Sprite;
  
  animState: Texture[]

  public static Instance: Player;

  frame = 0;
  facing: "left" | "right" = "right";
  climbSpeed = 20;

  constructor() {
    super({
      name   : "Player",
      texture: Assets.getResource("owo"),
    });

    Player.Instance = this;


    this.idle  = Assets.getResource("char_idle");
    this.walk  = Assets.getResource("char_walk");
    this.jump  = Assets.getResource("char_jump");
    this.climb = Assets.getResource("char_climb");

    this.animState = this.idle;

    this.x = Player.StartPosition.x;
    this.y = Player.StartPosition.y;


    this.glowOverlay = new Sprite(Assets.getResource("glow"))
    this.glowOverlay.blendMode = BLEND_MODES.SOFT_LIGHT;
    this.glowOverlay.tint = 0xfccad1;
    this.glowOverlay.alpha = 0.17;
    this.sprite.addChild(this.glowOverlay);
    this.glowOverlay.position.x -= 400;
    this.glowOverlay.position.y -= 400;
    this.glowOverlay.zIndex = 1;

  }

  audio: HTMLAudioElement | null = null;

  get grounded() {
    return this.hitInfo.down !== undefined
  }

  animate(state: IGameState) {
    if (state.tick % 8 === 0) {
      this.frame = (this.frame + 1) % this.animState.length;
    }
  }

  public collisionBounds(): Rect {
    return new Rect({
      x     : 400 - this.colliderSize.x / 2,
      y     : 400 - this.colliderSize.y / 2,
      width : this.colliderSize.x,
      height: this.colliderSize.y,
    })
  }

  checkForDialogTriggers(state: IGameState) {
    for (const trigger of state.map.dialogTriggers.filter(t => !t.triggered)) {
      if (trigger.region.rect.contains(this.position)) {
        const dialogName = trigger.region.properties["dialog"];

        trigger.triggered = true;

        if (!(dialogName in state.cinematics)) {
          throw new Error(`Cant find a cinematic named ${ dialogName }`);
        }

        this.startCoroutine(
          dialogName,
          (state.cinematics as any)[dialogName as any]()
        );
      }
    }
  }

  update(state: IGameState): void {
    this.animate(state);
    this.checkForDialogTriggers(state);

    this.velocity = this.velocity.withX(0);

    if (this.hitInfo.down || this.hitInfo.up) {
      this.velocity = this.velocity.withY(0);
    }

    const touchingVine = this.hitInfo.interactions.find(x => x.otherEntity instanceof Vine);

    if (touchingVine) {
      // Climb ladder

      this.velocity = this.velocity.addY(this.gravity);

      if (state.keys.down.A) {
        this.velocity = this.velocity.addX(-this.climbSpeed);
      }
  
      if (state.keys.down.D) {
        this.velocity = this.velocity.addX(this.climbSpeed/4);
      }

      if (state.keys.down.W) {
        this.velocity = this.velocity.addY(-this.climbSpeed/4);
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

      if (state.keys.down.A) {
        this.velocity = this.velocity.addX(-this.speed);
      }
  
      if (state.keys.down.D) {
        this.velocity = this.velocity.addX(this.speed);
      }

    }

    if (this.grounded) {
      if (touchingVine) {
        this.animState = this.climb;
      } else if (this.velocity.x === 0) {
        this.animState = this.idle;
      } else {
        this.animState = this.walk;
      }
    } else {
      if (touchingVine) {
        this.animState = this.climb;
      }
    }


    if (state.keys.justDown.Spacebar && (this.hitInfo.down || (touchingVine && this.velocity.y <= 2))) {
      this.velocity = this.velocity.withY(-this.jumpHeight);
      this.animState = this.jump;
      this.frame = 0;
    }

    this.texture = this.animState[this.frame];
    
    Game.Instance.camera.centerOn(this.position.add(new Vector2(0, -400)));

  }
}