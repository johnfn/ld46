import { ReadDebugFlagsFromLocalStorage } from "../library/react/debug_flag_buttons";

export const DebugFlags = ReadDebugFlagsFromLocalStorage({
  "Play Music"                   : { on: true, description: "" },
  "Set Position To Start Object" : { on: false, description: "" },
  "Show Initial Cinematic"       : { on: true, description: "" },
});