import { Entity } from "../library/entity";
import { TiledTilemap } from "../library/tilemap/tilemap";
import { TilemapRegion } from "../library/tilemap/tilemap_data";
import { Assets, AssetsToLoad } from "./assets";
import { Game } from "./game";
import { IGameState } from "Library";
import { SetAudioToLoop } from "./sfx";

type AllKeys = keyof typeof AssetsToLoad;
type AudioNames = {
  [P in AllKeys]: (typeof AssetsToLoad)[P]["type"] extends "Audio" ? P : null
}[AllKeys];

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

  music: { [key: string]: HTMLAudioElement } = {
    "music/Vines"    : SetAudioToLoop(Assets.getResource("music/Vines")),
    "music/The Hub"  : SetAudioToLoop(Assets.getResource("music/The Hub")),
    "music/Sanctuary": SetAudioToLoop(Assets.getResource("music/Sanctuary")),
    "music/Withers"  : SetAudioToLoop(Assets.getResource("music/Withers")),
  };

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