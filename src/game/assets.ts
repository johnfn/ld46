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
  | "music/Sanctuary.mp3"
  | "music/Withers.mp3"
  | "music.json"
  | "owo.png"
  | "parallax bg/00 - sky ver2.png"
  | "parallax bg/00 - sky.png"
  | "parallax bg/01 - skyline back.png"
  | "parallax bg/02 - skyline.png"
  | "parallax bg/03 - mist.png"
  | "parallax bg/04 - city back.png"
  | "parallax bg/05 - forest back.png"
  | "parallax bg/06 - city.png"
  | "parallax bg/07 - forest.png"
  | "parallax bg/bigcloud01.png"
  | "parallax bg/bigcloud02.png"
  | "parallax bg/bigcloud03.png"
  | "parallax bg/bigcloud04.png"
  | "parallax bg/bigcloud05.png"
  | "sound effects/Distant Gears.mp3"
  | "sound effects/step grass 1.mp3"
  | "sound effects/step grass 2.mp3"
  | "sound effects/step grass 3.mp3"
  | "sound effects/step stone 1.mp3"
  | "sound effects/step stone 2.mp3"
  | "sound effects/step stone 3.mp3"
  | "sound effects/step wood 1.mp3"
  | "sound effects/step wood 2.mp3"
  | "sound effects/step wood 3.mp3"
  | "spirit_empty_hud.png"
  | "spirit_full_hud.png"
  | "tileset.png"
  | "vine_flower_source.png"
  | "world.json"
  | "glow.png"
  | "char_climb (1).png"
  | "char_climb (2).png"
  | "char_climb (3).png"
  | "char_climb (4).png"
  | "char_climb (5).png"
  | "char_climb (6).png"
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
  | "char_jump (9).png"
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
  | "flower2 (1).png"
  | "flower2 (2).png"
  | "flower2 (3).png"
  | "flower2 (4).png"
  | "flower2 (5).png"
  | "flower2 (6).png"
  | "flower1 (1).png"
  | "flower1 (2).png"
  | "flower1 (3).png"
  | "flower1 (4).png"
  | "flower1 (5).png"
  | "flower1 (6).png"
  | "flower3 (1).png"
  | "flower3 (2).png"
  | "flower3 (3).png"
  | "flower3 (4).png"
  | "flower3 (5).png"
  | "flower4 (1).png"
  | "flower4 (2).png"
  | "flower4 (3).png"
  | "flower4 (4).png"
  | "vine_flower_live (1).png"
  | "vine_flower_live (2).png"
  | "vine_flower_live (3).png"
  | "vine_flower_live (4).png"
  | "vine_flower_live (5).png"
  | "vine_flower_live (6).png"
  | "vine_live (1).png"
  | "vine_live (2).png"
  | "vine_live (3).png"
  | "vine_live (4).png"
  | "vine_live (5).png"
  | "vine_live (6).png"
  | "vine_live (7).png"
  | "vine_live (8).png"



export const AssetsToLoad = {
  "dialog_box"                   : { type: "Image"       as const, path: "dialog_box.png"                    },
  "interactions"                 : { type: "TileMap"     as const, path: "interactions.json"                 },
  "loop1"                        : { type: "Audio"       as const, path: "loop1.mp3"                         },
  "loop2"                        : { type: "Audio"       as const, path: "loop2.mp3"                         },
  "map"                          : { type: "TileMap"     as const, path: "map.json"                          },
  "music/Sanctuary"              : { type: "Audio"       as const, path: "music/Sanctuary.mp3"               },
  "music/Withers"                : { type: "Audio"       as const, path: "music/Withers.mp3"                 },
  "music"                        : { type: "TileMap"     as const, path: "music.json"                        },
  "owo"                          : { type: "Image"       as const, path: "owo.png"                           },
  "parallax bg/00 - sky ver2"    : { type: "Image"       as const, path: "parallax bg/00 - sky ver2.png"     },
  "parallax bg/00 - sky"         : { type: "Image"       as const, path: "parallax bg/00 - sky.png"          },
  "parallax bg/01 - skyline back": { type: "Image"       as const, path: "parallax bg/01 - skyline back.png" },
  "parallax bg/02 - skyline"     : { type: "Image"       as const, path: "parallax bg/02 - skyline.png"      },
  "parallax bg/03 - mist"        : { type: "Image"       as const, path: "parallax bg/03 - mist.png"         },
  "parallax bg/04 - city back"   : { type: "Image"       as const, path: "parallax bg/04 - city back.png"    },
  "parallax bg/05 - forest back" : { type: "Image"       as const, path: "parallax bg/05 - forest back.png"  },
  "parallax bg/06 - city"        : { type: "Image"       as const, path: "parallax bg/06 - city.png"         },
  "parallax bg/07 - forest"      : { type: "Image"       as const, path: "parallax bg/07 - forest.png"       },
  "parallax bg/bigcloud01"       : { type: "Image"       as const, path: "parallax bg/bigcloud01.png"        },
  "parallax bg/bigcloud02"       : { type: "Image"       as const, path: "parallax bg/bigcloud02.png"        },
  "parallax bg/bigcloud03"       : { type: "Image"       as const, path: "parallax bg/bigcloud03.png"        },
  "parallax bg/bigcloud04"       : { type: "Image"       as const, path: "parallax bg/bigcloud04.png"        },
  "parallax bg/bigcloud05"       : { type: "Image"       as const, path: "parallax bg/bigcloud05.png"        },
  "sound effects/Distant Gears"  : { type: "Audio"       as const, path: "sound effects/Distant Gears.mp3"   },
  "sound effects/step grass 1"   : { type: "Audio"       as const, path: "sound effects/step grass 1.mp3"    },
  "sound effects/step grass 2"   : { type: "Audio"       as const, path: "sound effects/step grass 2.mp3"    },
  "sound effects/step grass 3"   : { type: "Audio"       as const, path: "sound effects/step grass 3.mp3"    },
  "sound effects/step stone 1"   : { type: "Audio"       as const, path: "sound effects/step stone 1.mp3"    },
  "sound effects/step stone 2"   : { type: "Audio"       as const, path: "sound effects/step stone 2.mp3"    },
  "sound effects/step stone 3"   : { type: "Audio"       as const, path: "sound effects/step stone 3.mp3"    },
  "sound effects/step wood 1"    : { type: "Audio"       as const, path: "sound effects/step wood 1.mp3"     },
  "sound effects/step wood 2"    : { type: "Audio"       as const, path: "sound effects/step wood 2.mp3"     },
  "sound effects/step wood 3"    : { type: "Audio"       as const, path: "sound effects/step wood 3.mp3"     },
  "spirit_empty_hud"             : { type: "Image"       as const, path: "spirit_empty_hud.png"              },
  "spirit_full_hud"              : { type: "Image"       as const, path: "spirit_full_hud.png"               },
  "tileset"                      : { type: "Image"       as const, path: "tileset.png"                       },
  "vine_flower_source"           : { type: "Image"       as const, path: "vine_flower_source.png"            },
  "glow"                         : { type: "Image"       as const, path: "glow.png"                          },
  "world"                        : { type: "TileWorld"   as const, path: "world.json"                        },

  /* Animations */

  "char_climb": {
    type: "Animation" as const,
    paths: [
      "char_climb (1).png",
      "char_climb (2).png",
      "char_climb (3).png",
      "char_climb (4).png",
      "char_climb (5).png",
      "char_climb (6).png",
    ],
  },
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
      "char_jump (9).png",
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
    ],
  },
  "flower1": {
    type: "Animation" as const,
    paths: [
      "flower1 (1).png",
      "flower1 (2).png",
      "flower1 (3).png",
      "flower1 (4).png",
      "flower1 (5).png",
      "flower1 (6).png",
    ],
  },
  "flower2": {
    type: "Animation" as const,
    paths: [
      "flower2 (1).png",
      "flower2 (2).png",
      "flower2 (3).png",
      "flower2 (4).png",
      "flower2 (5).png",
      "flower2 (6).png",
    ],
  },
  "flower3": {
    type: "Animation" as const,
    paths: [
      "flower3 (1).png",
      "flower3 (2).png",
      "flower3 (3).png",
      "flower3 (4).png",
      "flower3 (5).png",
    ],
  },
  "flower4": {
    type: "Animation" as const,
    paths: [
      "flower4 (1).png",
      "flower4 (2).png",
      "flower4 (3).png",
      "flower4 (4).png",
    ],
  },
  "vine_flower_live": {
    type: "Animation" as const,
    paths: [
      "vine_flower_live (1).png",
      "vine_flower_live (2).png",
      "vine_flower_live (3).png",
      "vine_flower_live (4).png",
      "vine_flower_live (5).png",
      "vine_flower_live (6).png",
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
      "vine_live (6).png",
      "vine_live (7).png",
      "vine_live (8).png",
    ],
  },
};

export const Assets = new TypesafeLoader(AssetsToLoad);
