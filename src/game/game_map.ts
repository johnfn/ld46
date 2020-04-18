import { Game } from "./game";
import { TiledTilemap } from "../library/tilemap/tilemap";
import { Rect } from "../library/geometry/rect";
import { Entity } from "../library/entity";
import { TilemapRegion } from "../library/tilemap/tilemap_data";
import { RectGroup } from "../library/geometry/rect_group";
import { Assets } from "./assets";
import { Texture } from "pixi.js";
import { NormalFlower } from "./normal_flower";
import { C } from "./constants";
import { VineFlower } from "./vine_flower";

export class GameMap extends Entity {
  artMap         : TiledTilemap;
  musicRegionsMap: TiledTilemap;
  musicRegions   : TilemapRegion[] = [];

  public static Instance: GameMap;

  constructor() {
    super({ 
      collidable: true,
      name: "Map",
    });

    GameMap.Instance = this;

    this.artMap = new TiledTilemap({
      pathToTilemap: "",
      scale        : C.Scale,
      json         : Assets.getResource("map"),
      renderer     : Game.Instance.renderer,
      customObjects: [
        {
          type     : "single",
          name     : "flower",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new NormalFlower();
          }
        },

        {
          type     : "single",
          name     : "vineflower",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new VineFlower(tex);
          }
        },
    ],
      assets: Assets
    });

    this.musicRegionsMap = new TiledTilemap({
      pathToTilemap: "",
      scale        : C.Scale,
      json         : Assets.getResource("music"),
      renderer     : Game.Instance.renderer,
      customObjects: [{
        type     : "rect",
        layerName: "Music Layer",
        process  : (rect: TilemapRegion) => {
          this.musicRegions.push(rect);
        }
      }],
      assets: Assets,
    });

    this.loadMap();
  }

  loadMap() {
    const layers = this.artMap.loadLayersInRect(new Rect({
      x     : -(256 * 10),
      y     : -(256 * 10),
      width :  6000,
      height:  6000,
    }));

    for (const layer of layers) {
      this.addChild(layer.entity);
    }
  }

  collisionBounds(): RectGroup {
    const bounds = new Rect({ x: -1000, y: -1000, width: 5000, height: 5000 });
    const rects = this.artMap._data.getCollidersInRegionForLayer(
      bounds,
      "Tile Layer 1"
    );

    return rects;
  }

  loadMusicRegions() {
  }
}