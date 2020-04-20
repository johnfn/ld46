import { Entity } from "../library/entity";
import { Assets } from "./assets";
import { IGameState } from "Library";
import { C } from "./constants";
import { TilingSprite, Point as PixiPoint } from "pixi.js";

export class ParallaxLayers extends Entity {
  layers = [
    { speed: 0.2 , texture: Assets.getResource("parallax bg/00 - sky"), },
    { speed: 0.25, texture: Assets.getResource("parallax bg/01 - skyline back"), },
    { speed: 0.3 , texture: Assets.getResource("parallax bg/02 - skyline"), },
    { speed: 0.35, texture: Assets.getResource("parallax bg/03 - mist"), },
    { speed: 0.4 , texture: Assets.getResource("parallax bg/04 - city back"), },
    { speed: 0.45, texture: Assets.getResource("parallax bg/05 - forest back"), },
    { speed: 0.5 , texture: Assets.getResource("parallax bg/06 - city"), },
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

    // this.scale = new Vector2(2, 2);

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
      layer.y = C.CanvasHeight * 4 - layer.height * 4;
    }

    this.sprites[6].y += 1000;
    this.sprites[6].tint = 0x999999;
  }

  update(state: IGameState) {
    for (let i = 0; i < this.layers.length; i++) {
      const layer  = this.layers[i];
      const sprite = this.sprites[i];

      sprite.tilePosition.x = state.camera.cameraFrame().x * layer.speed / 8;
    }
  }
}