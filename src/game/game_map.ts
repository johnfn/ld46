import { Game } from "./game";
import { TiledTilemap } from "../library/tilemap/tilemap";
import { Rect } from "../library/geometry/rect";
import { Entity } from "../library/entity";
import { TilemapRegion } from "../library/tilemap/tilemap_data";
import { GenericItem } from "./generic_item";
import { Texture } from "pixi.js";
import { RectGroup } from "../library/geometry/rect_group";
import { Assets } from "./assets";

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
      json         : Assets.getResource("map"),
      renderer     : Game.Instance.renderer,
      customObjects: [
        {
          type     : "single",
          name     : "fridge",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new GenericItem(tex,
              tileProperties["description"] as string
            );
          }
        },

        {
          type     : "single",
          name     : "toilet",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new GenericItem(tex, 
              tileProperties["description"] as string
            );
          }
        },

        {
          type     : "single",
          name     : "tv",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new GenericItem(tex, 
              tileProperties["description"] as string
            );
          }
        },
        {
          type     : "single",
          name     : "bookshelf",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new GenericItem(tex, 
              tileProperties["description"] as string
            );
          }
        },
        {
          type     : "single",
          name     : "photo frame",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new GenericItem(tex, 
              tileProperties["description"] as string
            );
          }
        },
        {
          type     : "single",
          name     : "sofa",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new GenericItem(tex, 
              tileProperties["description"] as string
            );
          }
        },

        {
          type     : "single",
          name     : "table",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new GenericItem(tex, 
              tileProperties["description"] as string
            );
          }
        },
        {
          type     : "single",
          name     : "bed",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new GenericItem(tex, 
              tileProperties["description"] as string
            );
          }
        },
        {
          type     : "single",
          name     : "lamp",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new GenericItem(tex, 
              tileProperties["description"] as string
            );
          }
        },
        {
          type     : "single",
          name     : "laptop",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, layerName: string) => {
            return new GenericItem(tex, 
              tileProperties["description"] as string
            );
          }
        },
    ],
      assets: Assets
    });

    this.musicRegionsMap = new TiledTilemap({
      pathToTilemap: "",
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

  bounds(): RectGroup {
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