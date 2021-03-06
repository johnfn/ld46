import { ReadDebugFlagsFromLocalStorage } from "../library/react/debug_flag_buttons";

export const DebugFlags = ReadDebugFlagsFromLocalStorage({
  "Play Music"                   : true,
  "Set Position To Start Object" : false,
  "Show Initial Cinematic"       : true,
  "Show Menu"                    : true,
  "Show Bud Text"                : true,
  "Show Flowers in Hierarchy"    : false,
  "Fairy Follows You Immediately": false,
  "High Performance"             : true,
  "Have Vine Perma"              : false,
  "Have Shroom Perma"            : false,
  "SKIP ALL DIALOG"              : false,
});