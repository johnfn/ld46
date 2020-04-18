// THIS FILE IS AUTOGENERATED from the parameters in config.json. Do not edit it.
// If you want to change something about how it's generated, look at library/asset_builder.ts.

import { TypesafeLoader } from "../library/typesafe_loader";

export type AssetType =
  | "Image"
  | "TileMap"
  | "TileWorld"
  | "Audio"
  | "Spritesheet"
  | "Animation"

export type AssetName = keyof typeof AssetsToLoad
export type AssetPath = 
  | "dialog_box.png"
  | "interactions.json"
  | "loop1.mp3"
  | "loop2.mp3"
  | "map.json"
  | "music.json"
  | "owo.png"
  | "parallax bg/bigcloud01.png"
  | "parallax bg/bigcloud02.png"
  | "parallax bg/bigcloud03.png"
  | "parallax bg/bigcloud04.png"
  | "parallax bg/bigcloud05.png"
  | "parallax bg/mist1.png"
  | "parallax bg/sky1.png"
  | "parallax bg/skyline1.png"
  | "tileset.png"
  | "vine_flower_source.png"
  | "world.json"
  | "char_idle (1).png"
  | "char_idle (2).png"
  | "char_idle (3).png"
  | "char_idle (4).png"
  | "char_idle (5).png"
  | "char_idle (6).png"
  | "char_idle (7).png"
  | "char_idle (8).png"
  | "char_idle (9).png"
  | "char_idle (10).png"
  | "char_idle (11).png"
  | "char_jump (1).png"
  | "char_jump (2).png"
  | "char_jump (3).png"
  | "char_jump (4).png"
  | "char_jump (5).png"
  | "char_jump (6).png"
  | "char_jump (7).png"
  | "char_jump (8).png"
  | "char_walk (1).png"
  | "char_walk (2).png"
  | "char_walk (3).png"
  | "char_walk (4).png"
  | "char_walk (5).png"
  | "char_walk (6).png"
  | "char_walk (7).png"
  | "char_walk (8).png"
  | "char_walk (9).png"
  | "char_walk (10).png"
  | "char_walk (11).png"
  | "char_walk (12).png"
  | "flower2_live (1).png"
  | "flower2_live (2).png"
  | "flower2_live (3).png"
  | "flower2_live (4).png"
  | "flower2_live (5).png"
  | "flower_live (1).png"
  | "flower_live (2).png"
  | "flower_live (3).png"
  | "flower_live (4).png"
  | "flower_live (5).png"
  | "flower_live2 (1).png"
  | "flower_live2 (2).png"
  | "flower_live2 (3).png"
  | "flower_live2 (4).png"
  | "flower_live2 (5).png"
  | "vine_live (1).png"
  | "vine_live (2).png"
  | "vine_live (3).png"
  | "vine_live (4).png"
  | "vine_live (5).png"



export const AssetsToLoad = {
  "dialog_box"            : { type: "Image"       as const, path: "dialog_box.png"             },
  "interactions"          : { type: "TileMap"     as const, path: "interactions.json"          },
  "loop1"                 : { type: "Audio"       as const, path: "loop1.mp3"                  },
  "loop2"                 : { type: "Audio"       as const, path: "loop2.mp3"                  },
  "map"                   : { type: "TileMap"     as const, path: "map.json"                   },
  "music"                 : { type: "TileMap"     as const, path: "music.json"                 },
  "owo"                   : { type: "Image"       as const, path: "owo.png"                    },
  "parallax bg/bigcloud01": { type: "Image"       as const, path: "parallax bg/bigcloud01.png" },
  "parallax bg/bigcloud02": { type: "Image"       as const, path: "parallax bg/bigcloud02.png" },
  "parallax bg/bigcloud03": { type: "Image"       as const, path: "parallax bg/bigcloud03.png" },
  "parallax bg/bigcloud04": { type: "Image"       as const, path: "parallax bg/bigcloud04.png" },
  "parallax bg/bigcloud05": { type: "Image"       as const, path: "parallax bg/bigcloud05.png" },
  "parallax bg/mist1"     : { type: "Image"       as const, path: "parallax bg/mist1.png"      },
  "parallax bg/sky1"      : { type: "Image"       as const, path: "parallax bg/sky1.png"       },
  "parallax bg/skyline1"  : { type: "Image"       as const, path: "parallax bg/skyline1.png"   },
  "tileset"               : { type: "Image"       as const, path: "tileset.png"                },
  "vine_flower_source"    : { type: "Image"       as const, path: "vine_flower_source.png"     },
  "world"                 : { type: "TileWorld"   as const, path: "world.json"                 },

  /* Animations */

  "char_idle": {
    type: "Animation" as const,
    paths: [
      "char_idle (1).png",
      "char_idle (2).png",
      "char_idle (3).png",
      "char_idle (4).png",
      "char_idle (5).png",
      "char_idle (6).png",
      "char_idle (7).png",
      "char_idle (8).png",
      "char_idle (9).png",
      "char_idle (10).png",
      "char_idle (11).png",
    ],
  },
  "char_jump": {
    type: "Animation" as const,
    paths: [
      "char_jump (1).png",
      "char_jump (2).png",
      "char_jump (3).png",
      "char_jump (4).png",
      "char_jump (5).png",
      "char_jump (6).png",
      "char_jump (7).png",
      "char_jump (8).png",
    ],
  },
  "char_walk": {
    type: "Animation" as const,
    paths: [
      "char_walk (1).png",
      "char_walk (2).png",
      "char_walk (3).png",
      "char_walk (4).png",
      "char_walk (5).png",
      "char_walk (6).png",
      "char_walk (7).png",
      "char_walk (8).png",
      "char_walk (9).png",
      "char_walk (10).png",
      "char_walk (11).png",
      "char_walk (12).png",
    ],
  },
  "flower2_live": {
    type: "Animation" as const,
    paths: [
      "flower2_live (1).png",
      "flower2_live (2).png",
      "flower2_live (3).png",
      "flower2_live (4).png",
      "flower2_live (5).png",
    ],
  },
  "flower_live": {
    type: "Animation" as const,
    paths: [
      "flower_live (1).png",
      "flower_live (2).png",
      "flower_live (3).png",
      "flower_live (4).png",
      "flower_live (5).png",
    ],
  },
  "flower_live2": {
    type: "Animation" as const,
    paths: [
      "flower_live2 (1).png",
      "flower_live2 (2).png",
      "flower_live2 (3).png",
      "flower_live2 (4).png",
      "flower_live2 (5).png",
    ],
  },
  "vine_live": {
    type: "Animation" as const,
    paths: [
      "vine_live (1).png",
      "vine_live (2).png",
      "vine_live (3).png",
      "vine_live (4).png",
      "vine_live (5).png",
    ],
  },
};

export const Assets = new TypesafeLoader(AssetsToLoad);
