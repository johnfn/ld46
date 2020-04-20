import { Entity } from "../library/entity";
import { TiledTilemap } from "../library/tilemap/tilemap";
import { TilemapRegion } from "../library/tilemap/tilemap_data";
import { Assets, AssetsToLoad } from "./assets";
import { Game } from "./game";
import { IGameState } from "Library";
import { SetAudioToLoop } from "./sfx";
import { GameCoroutine } from "../library/coroutine_manager";

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

  allMusic: { [key: string]: { coId: null | number; audio: HTMLAudioElement; } } = {
    "music/Vines"    : { coId: null, audio: SetAudioToLoop(Assets.getResource("music/Vines")), },
    "music/The Hub"  : { coId: null, audio: SetAudioToLoop(Assets.getResource("music/The Hub")), },
    "music/Sanctuary": { coId: null, audio: SetAudioToLoop(Assets.getResource("music/Sanctuary")), },
    "music/Withers"  : { coId: null, audio: SetAudioToLoop(Assets.getResource("music/Withers")), },
  };

  firstUpdate(state: IGameState) {
    for (const musicPath of Object.keys(this.allMusic)) {
      const songObj = this.allMusic[musicPath];

      songObj.audio.pause();
      songObj.audio.volume = 0;
      songObj.audio.currentTime = 0;
    }
  }

  update(state: IGameState) {
    const songPathsToPlay = this.musicRegions.filter(r => r.rect.contains(state.player.position)).map(k => k.properties["file"]);

    debugger;

    for (const musicPath of Object.keys(this.allMusic)) {
      const songObj = this.allMusic[musicPath];
      const shouldPlay = songPathsToPlay.includes(musicPath)

      if (shouldPlay && songObj.audio.volume < 1) {
        if (songObj.audio.paused) {
          songObj.audio.currentTime = 0;
          songObj.audio.play();
        }

        songObj.audio.volume = Math.min(songObj.audio.volume + 1/100, 1);
      }

      if (!shouldPlay && songObj.audio.volume > 0) {
        songObj.audio.volume = Math.max(songObj.audio.volume - 1/100, 0);
      }
    }
  }
}