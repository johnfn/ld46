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
import { Bud } from "./bud";
import { Fountain } from "./fountain";
import { BouncyShroom } from "./bouncy_shroom";
import { Npc } from "./npc";
import { Wisteria } from "./wisteria";
import { BigShroom } from "./big_shroom";

type FlowerRegion = {
  tilemapRegion: TilemapRegion,
  level?:        number,
}
export class GameMap extends Entity {
  artMap         : TiledTilemap;
  flowers        : NormalFlower[] = [];
  cameraRegions  : TilemapRegion[] = [];
  flowerRegions  : TilemapRegion[] = [];

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
            return null;
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
          name     : "npc",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            return new Npc(tileProperties, props.x, props.y);
          }
        },

        {
          type     : "single",
          name     : "interactable",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            return new Npc(tileProperties, props.x, props.y);
          }
        },

        {
          type     : "single",
          name     : "wisteria",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            return new Wisteria();
          }
        },

        {
          type     : "single",
          name     : "bigshroom",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            return new BigShroom();
          }
        },

        {
          type     : "single",
          name     : "big_shroom",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            return new BigShroom();
          }
        },

        {
          type     : "single",
          name     : "bouncyshroom",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            return new BouncyShroom();
          }
        },

        {
          type     : "single",
          name     : "fountain",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            return new Fountain();
          }
        },

        {
          type     : "single",
          name     : "start",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            if (DebugFlags["Set Position To Start Object"]) {
              setTimeout(() => {
                Player.Instance.x = props.x;
                Player.Instance.y = props.y;

                Game.Instance.camera.centerOn(Player.Instance.position.add(new Vector2(0, -400)), true);
              }, 100);
            }

            return null;
          }
        },

        {
          type     : "single",
          name     : "bud-start",
          getInstanceType: (tex: Texture, tileProperties: { [key: string]: unknown }, props: GetInstanceTypeProps) => {
            return new Bud();
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
          layerName: "Flower Region Layer",
          process  : region => {
            this.flowerRegions.push(region);
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

    this.loadFlowers()

    for (const layer of layers) {
      this.addChild(layer.entity);
    }
  }

  loadFlowers() {
    let frequency = 2;
    for (const region of this.flowerRegions) {
      if (region.properties["frequency"]) {
        frequency = parseInt(region.properties["frequency"])
      }
      let numFlowers = Math.round(frequency * region.rect.width / 256 / 2); // 2 is just because the lowest frequency was still too many flowers

      for (let i = 0; i < numFlowers; i++) {
        let f: NormalFlower;
        const position = region.rect.topLeft.addX(128).addX(Math.random()*(region.rect.width-256));
        if (region.properties["level"]) {
          f = new NormalFlower(position, parseInt(region.properties["level"]))
        } else {
          f = new NormalFlower(position)
        }
        this.addChild(f)
      }
      
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
