import { BaseGame } from "../library/base_game";
import { AssetsToLoad, Assets } from "./assets";
import { Player } from "./player";
import { GameMap } from "./game_map";
import { DialogBox } from "./dialog_box";
import { DebugFlags } from "./debug";
import { C } from "./constants";
import { Overlay } from "./overlay";
import { Cinematics } from "./cinematics";
import { DialogOverlay } from "./dialog_overlay";
import { Hud } from "./hud";
import { NpcDialog } from "./npc";

export class Game extends BaseGame<typeof AssetsToLoad> {
  public static Instance: Game;

  public cinematics: Cinematics;

  constructor() {
    super({
      canvasWidth : C.CanvasWidth,
      canvasHeight: C.CanvasHeight,
      tileWidth   : 256,
      tileHeight  : 256,
      scale       : 1/4,
      assets      : Assets,
      debugFlags  : DebugFlags,
      state       : {
        tick         : 0,
        spiritTotal  : 3,
        spiritUnused : 3,
        budFollowing : DebugFlags["Fairy Follows You Immediately"],

        // These are set later.
        player       : undefined as any,
        overlay      : undefined as any,
        map          : undefined as any,
        camera       : undefined as any,
        cinematics   : undefined as any,
      }
    });

    Game.Instance = this;
    this.cinematics = new Cinematics(this.coroutineManager, this);

    this.state.cinematics = this.cinematics;
  }

  initialize() {
    this.stage.addChild(this.state.map = new GameMap());
    this.stage.addChild(this.state.player = new Player());

    this.fixedCameraStage.addChild(this.state.overlay = new Overlay());
    this.fixedCameraStage.addChild(new DialogBox());
    this.fixedCameraStage.addChild(new DialogOverlay());
    this.stage.addChild(new NpcDialog());
    this.fixedCameraStage.addChild(new Hud(this.state.spiritTotal));

    if (DebugFlags["Show Initial Cinematic"]) {
      this.coroutineManager.startCoroutine(
        "Initial Cinematic",
        this.cinematics.openingCinematic(),
        this
      );
    }
  };
}
