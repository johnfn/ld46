import { Entity } from "../library/entity";
import { TiledTilemap } from "../library/tilemap/tilemap";
import { TilemapRegion } from "../library/tilemap/tilemap_data";
import { Assets } from "./assets";
import { Game } from "./game";
import { IGameState } from "Library";

export class MusicMap extends Entity {
  musicRegionsMap: TiledTilemap;
  musicRegions   : TilemapRegion[] = [];

  constructor() {
    super({
      name: "MusicMap",
    });

    this.musicRegionsMap = new TiledTilemap({
      pathToTilemap: "",
      json         : Assets.getResource("music"),
      renderer     : Game.Instance.renderer,
      customObjects: [{
        type     : "rect",
        layerName: "Music Regions",
        process  : (rect: TilemapRegion) => {
          this.musicRegions.push(rect);
        }
      }],
      assets: Assets,
    });
  }

  playing = false;

  update(state: IGameState) {
    for (const region of this.musicRegions) {
      if (region.rect.contains(this.position)) {
        const songPath = region.properties["file"];

        if (!this.playing) {
          const audio = new Audio(songPath);
          audio.play();
          audio.loop = true;

          this.playing = true;
        }
      }
    }
  }
}