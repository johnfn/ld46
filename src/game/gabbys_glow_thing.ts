import { Entity } from "../library/entity";
import { Sprite, BLEND_MODES } from "pixi.js";
import { Assets } from "./assets";

export class GabbysGlowThing extends Entity {
  glowOverlay: Sprite;
  
  constructor(tint: number) {
    super({ 
      name: "GabbysGlowThing",
    });

    this.glowOverlay = new Sprite(Assets.getResource("glow"))
    this.glowOverlay.blendMode = BLEND_MODES.SOFT_LIGHT;
    this.glowOverlay.tint = tint;
    this.glowOverlay.alpha = 0.17;
    this.sprite.addChild(this.glowOverlay);
    this.glowOverlay.position.x -= 800;
    this.glowOverlay.position.y -= 400;
    this.glowOverlay.zIndex = 1;
  }
}