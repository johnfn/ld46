import { Entity } from "../library/entity";
import { Assets } from "./assets";
import { IGameState } from "Library";
import { C } from "./constants";
import { TilingSprite, Point as PixiPoint } from "pixi.js";

export class ParallaxLayers extends Entity {
  scaleFactor = 2.3
  layers = [
    { speed: -0.03 , texture: Assets.getResource("parallax bg/00 - sky"), },
    { speed: -0.04, texture: Assets.getResource("parallax bg/01 - skyline back"), },
    { speed: -0.08 , texture: Assets.getResource("parallax bg/02 - skyline"), },
    { speed: -0.1, texture: Assets.getResource("parallax bg/03 - mist"), },
    { speed: -0.12 , texture: Assets.getResource("parallax bg/04 - city back"), },
    { speed: -0.15, texture: Assets.getResource("parallax bg/05 - forest back"), },
    { speed: -0.25 , texture: Assets.getResource("parallax bg/06 - city"), },
    { speed: -0.6 , texture: Assets.getResource("parallax bg/07 - forest"), },
    { speed: -0.3 , texture: Assets.getResource("hub bg/hub_bg1"), },
  ];

  sprites: TilingSprite[] = [];

  clouds = [
    Assets.getResource("parallax bg/bigcloud01"),
    Assets.getResource("parallax bg/bigcloud02"),
    Assets.getResource("parallax bg/bigcloud03"),
    Assets.getResource("parallax bg/bigcloud04"),
    Assets.getResource("parallax bg/bigcloud05"),
  ];

  constructor() {
    super({
      name: "ParallaxLayers",
    });

    for (const { texture } of this.layers) {
      const sprite = new TilingSprite(texture, texture.width, texture.height);
      sprite.scale = new PixiPoint(4, 4);

      this.sprites.push(sprite);
    }

    for (const layer of this.sprites) {
      this.sprite.addChild(layer);
    }
  }

  firstUpdate(state: IGameState) {
    for (const layer of this.sprites) {
      layer.x = 0;
      layer.y = C.CanvasHeight * this.scaleFactor - layer.height * this.scaleFactor;
    }
    
    this.changeBackground(0);

    // 00 - sky
    // 01 - skyline back
    this.sprites[1].y -= 500;
    // 02 - skyline
    this.sprites[2].y -= 20;
    // 03 - mist
    // 04 - city back
    this.sprites[4].y -= 200;
    this.sprites[4].tint = 0xBDBDBD;
    // 05 - forest back
    this.sprites[5].y += 300;
    this.sprites[5].tileScale = new PixiPoint(2, 2);
    // 06 - city
    this.sprites[6].tileScale = new PixiPoint(1, 1);
    this.sprites[6].y += 450;
    this.sprites[6].tint = 0xBDBDBD;
    // 07 - forest
    this.sprites[7].tileScale = new PixiPoint(2.2, 2.2);
    this.sprites[7].y += 1400;
    this.sprites[7].alpha = 0.9;
  
  }

  update(state: IGameState) {
    for (let i = 0; i < this.layers.length; i++) {
      const layer  = this.layers[i];
      const sprite = this.sprites[i];

      sprite.tilePosition.x = state.camera.cameraFrame().x * layer.speed / 4;
    }
    this.sprites[0].tilePosition.x += state.tick * -0.5;
    this.sprites[5].tilePosition.x += state.tick * -0.05;
    this.sprites[7].tilePosition.x += state.tick * -0.4;

    // hub
    this.sprites[8].tilePosition.y = state.camera.cameraFrame().y * this.layers[8].speed / 6;
  }

  changeBackground(backgroundIndex: number) {
    // city
    if (backgroundIndex === 0) {
      this.sprites.forEach(spr => spr.visible = true);
      this.sprites[8].visible = false;
    }
    // hub
    else if (backgroundIndex === 1) {
      this.sprites.forEach(spr => spr.visible = false);
      this.sprites[8].visible = true;
    }
  }
}
