import { Game } from "./game";
import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Texture } from "pixi.js";
import { Rect } from "../library/geometry/rect";
import { Vine } from "./vine_flower";
import { Vector2 } from "../library/geometry/vector2";
import { BouncyShroom } from "./bouncy_shroom";
import { Mode } from "Library";
import { GabbysGlowThing } from "./gabbys_glow_thing";

export class Player extends Entity {
  activeModes: Mode[] = ["Normal", "Dialog"];
  public static StartPosition = new Vector2(-12000, 900);
  public static Instance: Player;

  speed      = 30;
  jumpHeight = 60;
  gravity    = 2;
  colliderSize = new Vector2(100, 530);

  idle:  Texture[];
  walk:  Texture[];
  jump:  Texture[];
  climb: Texture[];

  animState: Texture[]


  frame = 0;
  facing: "left" | "right" = "right";
  climbSpeed = 20;

  /** 
   * If the character is climbing a ladder, we cap abs(velocity.y) at
   * climbSpeed (so that holding up doesnt cause them to fly into the air).
   * 
   * If the character is jumping, we don't cap velocity.y at all.
   * 
   * If the character jumps while on a ladder, we need to keep track of which
   * behavior we want, so we have this flag.
   */
  jumpingOnLadder = false;

  // The first jump on a bouncyshroom should be higher than your initial jump.
  // The rest aren't though, to stop infinitely high jumps.
  hasBouncedOnShroomThisJump = false;

  graphic: Entity;

  constructor() {
    super({
      name: "Player",
    });

    this.graphic = new Entity({ name: "PlayerGraphic" });
    this.addChild(this.graphic);

    this.graphic.x = -300;
    this.graphic.y = -100;

    Player.Instance = this;

    this.idle  = Assets.getResource("char_idle");
    this.walk  = Assets.getResource("char_walk");
    this.jump  = Assets.getResource("char_jump");
    this.climb = Assets.getResource("char_climb");

    this.animState = this.idle;

    this.x = Player.StartPosition.x;
    this.y = Player.StartPosition.y;

    this.addChild(new GabbysGlowThing(0xfccad1));
  }

  audio: HTMLAudioElement | null = null;

  get grounded() {
    return this.hitInfo.down !== undefined
  }

  animate(state: IGameState) {
    if (state.tick % 6 === 0) {
      if (this.animState === this.jump && this.frame >= this.animState.length - 3) {
        this.frame = this.animState.length - 3 + (state.tick % 12) / 6;
      } else {
        this.frame = (this.frame + 1) % this.animState.length;
      }
    }
    this.graphic.texture = this.animState[this.frame];  
  }

  public collisionBounds(): Rect {
    return new Rect({
      x     : 0,
      y     : 40,
      width : this.colliderSize.x,
      height: this.colliderSize.y,
    })
  }

  checkForDialogTriggers(state: IGameState) {
    const trigger = state.map.dialogTriggers.find(t => !t.triggered && t.region.rect.contains(this));

    if (!trigger) { return; }

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

  calculateVelocity(state: IGameState, touchingVine: boolean) {
    //const touchingBouncyBoi = this.hitInfo.collisions.find(x => x.otherEntity instanceof BouncyShroom && x.otherEntity.isActivated) !== undefined;
    const touchingBouncyBoi = this.hitInfo.interactions.find(x => x.otherEntity instanceof BouncyShroom && x.otherEntity.isActivated) !== undefined;
    console.log(touchingBouncyBoi);

    const prevVelocity = this.velocity;
    this.velocity = this.velocity.withX(0);

    if (this.hitInfo.down || this.hitInfo.up) {
      this.velocity = this.velocity.withY(0);
      this.jumpingOnLadder = false;
    }

    if ((this.hitInfo.down && !touchingBouncyBoi) || touchingVine) {
      this.hasBouncedOnShroomThisJump = false;
    }

    if (touchingVine) {
      // Climb ladder

      this.hasBouncedOnShroomThisJump = false;

      if (!this.jumpingOnLadder) {
        this.velocity = this.velocity.withY(0)
      }

      if (state.keys.down.Left) {
        this.velocity = this.velocity.addX(-this.climbSpeed);
      }
  
      if (state.keys.down.Right) {
        this.velocity = this.velocity.addX(this.climbSpeed);
      }

      if (state.keys.down.Up) {
        if (!this.jumpingOnLadder) {
          this.velocity = this.velocity.addY(-this.climbSpeed);
        }

        if (this.velocity.y > 1) {
          this.jumpingOnLadder = false;
        }
      } 

      if (state.keys.down.Down) {
        this.velocity = this.velocity.addY(this.climbSpeed);
        this.jumpingOnLadder = false;
      }

      if (this.jumpingOnLadder) {
        this.velocity = this.velocity.addY(this.gravity);
      } else {
        this.velocity = this.velocity.clampY(-this.climbSpeed, this.climbSpeed);
      }
    } else {
      // gravity

      this.velocity = this.velocity.addY(this.gravity);

      if (state.keys.down.Left) {
        this.velocity = this.velocity.addX(-this.speed);
      }
  
      if (state.keys.down.Right) {
        this.velocity = this.velocity.addX(this.speed);
      }
    }

    if (state.keys.justDown.Z && (this.hitInfo.down || (touchingVine && this.velocity.y >= -this.climbSpeed))) {
      this.velocity = this.velocity.withY(-this.jumpHeight);
      this.animState = this.jump;
      this.frame = 0;

      if (touchingVine) {
        this.jumpingOnLadder = true;
      }
    }

    if (touchingBouncyBoi) {
      let newVelocity: number;
      
      if (!this.hasBouncedOnShroomThisJump) {
        let addition = Math.abs(prevVelocity.y) * 0.5;

        if (addition > 30) { addition = 30; }

        newVelocity = Math.abs(prevVelocity.y) + addition;
      } else {
        newVelocity = Math.abs(prevVelocity.y / 1.2);
      }

      if (newVelocity < 65) { newVelocity = 65; } // always bounce a little (valuable life advice too)
      if (newVelocity > 200) { newVelocity = 200; } // dont bounce too much (hey, that's also good life advice!)

      this.velocity = this.velocity.withY(-newVelocity);
      this.hasBouncedOnShroomThisJump = true;
    }
  }

  firstUpdate(state: IGameState) {
    Game.Instance.camera.centerOn(this.position.add(new Vector2(0, 0)), true);
  }

  update(state: IGameState): void {
    this.animate(state);

    if (state.mode === "Dialog") {
      
      // BUG: If you're in the air while entering dialog, you'll just stay there for the duration of dialog. 

      this.velocity = Vector2.Zero;
      this.animState = this.idle;
      return;
    }

    if (this.animState == this.walk && (this.frame) % Math.floor(this.animState.length/4) === 0) {
      state.sfx.stepStone1.play();
    }

    this.checkForDialogTriggers(state);

    const touchingVine = this.hitInfo.interactions.find(x => x.otherEntity instanceof Vine && x.otherEntity.isActivated) !== undefined;
    this.calculateVelocity(state, touchingVine);

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
      } else {
        this.animState = this.jump;
      }
    }

    Game.Instance.camera.centerOn(this.position.add(new Vector2(this.scale.x > 0 ? 1000 : -1000, -400)));

    if (this.velocity.x > 0 && this.scale.x < 0) {
      this.scale = this.scale.invertX();
      this.graphic.x = -300;
    }

    if (this.velocity.x < 0 && this.scale.x > 0) {
      this.scale = this.scale.invertX();
      this.graphic.x = -500;
    }
  }
}