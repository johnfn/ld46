import { Entity } from "../library/entity";
import { Assets } from "./assets";
import { IGameState } from "Library";
import { C } from "./constants";
import { TilingSprite, Point as PixiPoint, Texture } from "pixi.js";
import { GameCoroutine } from "../library/coroutine_manager";
import { Cinematics } from "./cinematics";

let parallax_layer_id = 0;

class Layer extends Entity {

  layers: TilingSprite[] = [];
  speed: number
  scaleFactor = 2.3
  parallax_layer_id: number;

  constructor(speed: number, textures: Texture[]) {
    super({name: "Parallax Layer"})
    this.speed = speed;
    for (let i = 0; i < textures.length; i++) {
      const tilingSprite = (new TilingSprite(textures[i], textures[i].width, textures[i].height))
      tilingSprite.scale = new PixiPoint(4, 4);
      tilingSprite.visible = !!i;
      this.sprite.addChild(tilingSprite);
      this.layers[i] = tilingSprite;
    }
    this.parallax_layer_id = ++parallax_layer_id;
  }

  firstUpdate(state: IGameState) {
    for (const layer of this.layers) {
      layer.x = 0;
      layer.y = C.CanvasHeight * this.scaleFactor - layer.height * this.scaleFactor;
    }
  }

  update(state: IGameState) {
    for (let i = 0; i < this.layers.length; i++) {
      if (!this.layers[i].visible && i <= (state.spiritTotal - 3)) {
        this.startCoroutine(`makeParallaxLayerVisible${this.id}`, this.makeVisible(i));
      }
      this.layers[i].visible = i <= (state.spiritTotal - 3);
      this.layers[i].tilePosition.x = state.camera.cameraFrame().x * this.speed / 4;
    }
  }

  *makeVisible(i: number): GameCoroutine {
    this.layers[i].alpha = 0;
    this.layers[i].visible = true;
    let state = yield "next";
    yield* Cinematics.LinearTween({
      set   : x => this.layers[i].alpha = x,
      start : 0,
      stop  : 1,
      frames: 120,
    })
  }

  set tileScale(scale: PixiPoint) {
    for (const layer of this.layers) {
      layer.tileScale = scale;
    }
  }

  set tint(color: number) {
    for (const layer of this.layers) {
      layer.tint = color;
    }
  }

  get tilePosition() {
    return this.layers[0].tilePosition;
  }

  set tilePosition(x: PixiPoint) {
    for (const layer of this.layers) {
      layer.tilePosition = x;
    }
  }
}

export class ParallaxLayers extends Entity {

  layers2 = [
    new Layer(-0.03, [Assets.getResource("parallax bg/00 - sky")]),
    new Layer(-0.04, [Assets.getResource("parallax bg/01 - skyline back")]),
    new Layer(-0.08, [Assets.getResource("parallax bg/02 - skyline")]),
    new Layer(-0.10, [Assets.getResource("parallax bg/03 - mist")]),
    new Layer(-0.12, [Assets.getResource("parallax bg/04 - city back")]),
    new Layer(-0.15, [Assets.getResource("parallax bg/05 - forest back")]),
    new Layer(-0.25, [Assets.getResource("parallax bg/06 - city"), Assets.getResource("parallax bg/06 - city_01"), Assets.getResource("parallax bg/06 - city_02")]),
    new Layer(-0.60, [Assets.getResource("parallax bg/07 - forest")]),
    new Layer(-0.30, [Assets.getResource("hub bg/hub_bg1")]),
  ]

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

    for (const layer of this.layers2) {
      this.addChild(layer);
    }

    // for (const { texture, type } of this.layers) {
    //   const sprite = new TilingSprite(texture, texture.width, texture.height);
    //   sprite.scale = new PixiPoint(4, 4);
    //   sprite.visible = !!type;
    //   this.sprites.push(sprite);
    // }

    // for (const layer of this.sprites) {
    //   this.sprite.addChild(layer);
    // }
  }

  firstUpdate(state: IGameState) {
    // for (const layer of this.sprites) {
    //   layer.x = 0;
    //   layer.y = C.CanvasHeight * this.scaleFactor - layer.height * this.scaleFactor;
    // }
    
    this.changeBackground(0);

    //TODO: change sprites array to a map so this isn't hard to maintain
    // 00 - sky
    // 01 - skyline back
    this.layers2[1].y -= 500;
    // 02 - skyline
    this.layers2[2].y -= 20;
    // 03 - mist
    // 04 - city back
    this.layers2[4].y -= 200;
    this.layers2[4].tint = 0xBDBDBD;
    // 05 - forest back
    this.layers2[5].y += 300;
    this.layers2[5].tileScale = new PixiPoint(2, 2);
    // 06 - city
    this.layers2[6].tileScale = new PixiPoint(1, 1);
    this.layers2[6].y += 450;
    this.layers2[6].tint = 0xBDBDBD;
    // 07 - forest
    this.layers2[7].tileScale = new PixiPoint(2.2, 2.2);
    this.layers2[7].y += 1400;
    this.layers2[7].alpha = 0.9;
  
  }

  update(state: IGameState) {
    this.layers2[0].tilePosition.x += state.tick * -0.5;
    this.layers2[5].tilePosition.x += state.tick * -0.05;
    this.layers2[8].tilePosition.x += state.tick * -0.4;

    // hub
    this.layers2[8].tilePosition.y = state.camera.cameraFrame().y * this.layers2[8].speed / 6;
  }

  changeBackground(backgroundIndex: number) {
    // city
    if (backgroundIndex === 0) {
      this.layers2.forEach(layer => layer.visible = true);
      this.layers2[8].visible = false;
    }
    // // hub
    // else if (backgroundIndex === 1) {
    //   this.sprites.forEach(spr => spr.visible = false);
    //   this.sprites[8].visible = true;
    // }
  }
}
