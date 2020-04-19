import { Game } from "./game";
import { TiledTilemap } from "../library/tilemap/tilemap";
import { Rect } from "../library/geometry/rect";
import { Entity } from "../library/entity";
import { TilemapRegion } from "../library/tilemap/tilemap_data";
import { RectGroup } from "../library/geometry/rect_group";
import { Assets } from "./assets";
import { Texture } from "pixi.js";
import { NormalFlower } from "./normal_flower";
import { VineFlower } from "./vine_flower";
import { Player } from "./player";
import { GetInstanceTypeProps } from "../library/tilemap/tilemap_objects";
import { Debug } from "../library/debug";
import { DebugFlagButtons } from "../library/react/debug_flag_buttons";
import { DebugFlags } from "./debug";

export class GameMap extends Entity {
  artMap         : TiledTilemap;
  // musicRegionsMap: TiledTilemap;
  musicRegions   : TilemapRegion[] = [];
  cameraRegions  : TilemapRegion[] = [];

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
          name     : "flower",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            return new NormalFlower();
          }
        },

        {
          type     : "single",
          name     : "vineflower",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            return new VineFlower(tex);
          }
        },

        {
          type     : "single",
          name     : "start",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            if (DebugFlags["Set Position To Start Object"].on) {
              setTimeout(() => {
                Player.Instance.x = props.x;
                Player.Instance.y = props.y;
              }, 100);
            }
            return null;
          }
        },

        {
          type     : "rect",
          layerName: "Camera Region Layer",
          process  : region => {
            this.cameraRegions.push(region);
          },
        },
    ],
      assets: Assets
    });

    // this.musicRegionsMap = new TiledTilemap({
    //   pathToTilemap: "",
    //   json         : Assets.getResource("music"),
    //   renderer     : Game.Instance.renderer,
    //   customObjects: [{
    //     type     : "rect",
    //     layerName: "Music Layer",
    //     process  : (rect: TilemapRegion) => {
    //       this.musicRegions.push(rect);
    //     }
    //   }],
    //   assets: Assets,
    // });

    this.loadMap();
  }

  getCameraRegion(player: Player): TilemapRegion {
    for (const region of this.cameraRegions) {
      if (region.rect.contains(player.positionAbsolute())) {
        return region;
      }
    }

    throw new Error("No camera region for that location. Halp!")
  }

  loadMap() {
    const layers = this.artMap.loadLayersInRect(new Rect({
      x     : -(256 * 10),
      y     : -(256 * 10),
      width :  9000,
      height:  9000,
    }));

    for (const layer of layers) {
      this.addChild(layer.entity);
    }
  }

  collisionBounds(): RectGroup {
    const bounds = new Rect({ x: -5000, y: -5000, width: 10000, height: 10000 });
    const rects = this.artMap._data.getCollidersInRegionForLayer(
      bounds,
      "Tile Layer 1"
    );

    rects.subtract(this.positionAbsolute());

    return rects;
  }

  loadMusicRegions() {
  }
}