import { Entity } from "../library/entity";
import { Sprite, BLEND_MODES, Point } from "pixi.js";
import { Assets } from "./assets";
import { Vector2 } from "../library/geometry/vector2";
import { IGameState } from "Library";
import { Player } from "./player";
import { BouncyShroom } from "./bouncy_shroom";
import { VineFlower } from "./vine_flower";

export class GabbysGlowThing extends Entity {
  glowOverlay: Sprite;
  parentSize: Vector2 = Vector2.Zero;
  myParent: Entity | undefined;
  myFrame: number = 0;
  
  constructor(tint: number, parent: Entity) {
    super({ 
      name: "GabbysGlowThing",
    });
  
    this.myParent = parent;

    this.glowOverlay = new Sprite(Assets.getResource("glow"))
    this.glowOverlay.blendMode = BLEND_MODES.SCREEN_NPM;
    this.glowOverlay.tint = tint;
    this.glowOverlay.alpha = 0.5;
    
    if (parent instanceof Player) {
    this.glowOverlay.scale = new Point(5,5);
    this.glowOverlay.position = new Point(-(800 - 256 + 100), -400); //UGH
    } else if (parent instanceof BouncyShroom || parent instanceof VineFlower) {
      const parentSize = new Vector2(this.myParent?.sprite.width!, this.myParent?.sprite.height!);
      const mySize = new Vector2(this.glowOverlay.width, this.glowOverlay.height);
      this.glowOverlay.scale = new Point(2*parentSize.x/mySize.x, 2*parentSize.y/mySize.y);
      this.glowOverlay.position.set(this.glowOverlay.position.x - 150, this.glowOverlay.position.y)
    } else {
      // idk man
      const parentSize = new Vector2(this.myParent?.sprite.width!, this.myParent?.sprite.height!);
      const mySize = new Vector2(this.glowOverlay.width, this.glowOverlay.height);
      this.glowOverlay.scale = new Point(parentSize.x/mySize.x, parentSize.y/mySize.y);
    }
  

    this.sprite.addChild(this.glowOverlay);

  }

  update(state: IGameState) {
    this.alpha = 0.5 + (1 - Math.sin((this.myFrame) / 30))/4
    this.myFrame++;
  }

}