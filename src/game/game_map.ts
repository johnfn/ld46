import { Game } from "./game";
import { TiledTilemap } from "../library/tilemap/tilemap";
import { Entity } from "../library/entity";
import { TilemapRegion } from "../library/tilemap/tilemap_data";
import { RectGroup } from "../library/geometry/rect_group";
import { Assets } from "./assets";
import { Texture } from "pixi.js";
import { NormalFlower } from "./normal_flower";
import { VineFlower } from "./vine_flower";
import { Player } from "./player";
import { GetInstanceTypeProps } from "../library/tilemap/tilemap_objects";
import { DebugFlags } from "./debug";
import { Vector2 } from "../library/geometry/vector2";
import { IGameState } from "Library";
import { MusicMap } from "./music_map";

export class GameMap extends Entity {
  artMap         : TiledTilemap;
  cameraRegions  : TilemapRegion[] = [];

  public static Instance: GameMap;
  public dialogTriggers: { region: TilemapRegion, triggered: boolean }[] = [];

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

        {
          type     : "rect",
          layerName: "Dialog Trigger Layer",
          process  : region => {
            this.dialogTriggers.push({ region, triggered: false });
          },
        },
    ],
      assets: Assets
    });
    
    this.loadMap(Player.StartPosition);

    if (DebugFlags["Play Music"]) {
      const musicMap = new MusicMap();
      this.addChild(musicMap);
    }
  }

  getCameraRegion(pos: Vector2): TilemapRegion {
    for (const region of this.cameraRegions) {
      if (region.rect.contains(pos)) {
        return region;
      }
    }

    throw new Error("No camera region for that location. Halp!")
  }

  loadMap(position: Vector2) {
    const newBounds = this.getCameraRegion(position).rect;

    const layers = this.artMap.loadLayersInRect(newBounds);

    for (const layer of layers) {
      this.addChild(layer.entity);
    }
  }

  collisionBounds(): RectGroup {
    const bounds = this.getCameraRegion(Player.Instance.position).rect;
    const rects = this.artMap._data.getCollidersInRegionForLayer(
      bounds,
      "Tile Layer 1"
    );

    rects.subtract(this.positionAbsolute());

    return rects;
  }

  loadMusicRegions() {

  }

  update(state: IGameState) {
    const oldRegion = state.camera.getBounds();
    const cameraRegion = state.map.getCameraRegion(state.player.position).rect;

    if (!oldRegion.equals(cameraRegion)) {
      this.loadMap(state.player.position);
    }

    state.camera.setBounds(cameraRegion);
  }
}
