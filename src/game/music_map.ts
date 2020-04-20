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

  allMusic: { [key: string]: { audio: HTMLAudioElement; } } = {
    "music/Vines"    : { audio: SetAudioToLoop(Assets.getResource("music/Vines")), },
    "music/The Hub"  : { audio: SetAudioToLoop(Assets.getResource("music/The Hub")), },
    "music/Sanctuary": { audio: SetAudioToLoop(Assets.getResource("music/Sanctuary")), },
    "music/Withers"  : { audio: SetAudioToLoop(Assets.getResource("music/Withers")), },
  };

  update(state: IGameState) {
    const songPathsToPlay = this.musicRegions.filter(r => r.rect.contains(this.position)).map(k => k.properties["file"]);

    for (const musicPath of Object.keys(this.allMusic)) {
      const songObj = this.allMusic[musicPath];
      const shouldPlay = songPathsToPlay.includes(musicPath)

      if (shouldPlay && songObj.audio.paused) {
        songObj.audio.currentTime = 0;
        songObj.audio.play();
      }

      if (!shouldPlay && !songObj.audio.paused) {
        songObj.audio.currentTime = 0;
        songObj.audio.pause();
      }
    }
  }
}