import { BaseGame } from "../library/base_game";
import { AssetsToLoad, Assets } from "./assets";
import { Player } from "./player";
import { GameMap } from "./game_map";
import { DialogBox } from "./dialog_box";
import { DebugFlags } from "./debug";
import { GameState } from "./state";
import { C } from "./constants";
import { Overlay } from "./overlay";
import { Cinematics } from "./cinematics";
import { DialogTexts } from "./dialog_text";
import { DialogOverlay } from "./dialog_overlay";

export class Game extends BaseGame<typeof AssetsToLoad> {
  public static Instance: Game;

  public cinematics: Cinematics;

  constructor() {
    super({
      canvasWidth : C.CanvasWidth,
      canvasHeight: C.CanvasHeight,
      tileWidth   : 256,
      tileHeight  : 256,
      scale       : 0.25,
      assets      : Assets,
      debugFlags  : DebugFlags,
      state       : new GameState()
    });

    Game.Instance = this;
    this.cinematics = new Cinematics(this.coroutineManager, this);
  }

  initialize() {
    this.stage.addChild(new GameMap());
    this.stage.addChild(this.state.player = new Player());

    this.fixedCameraStage.addChild(this.state.overlay = new Overlay());
    this.fixedCameraStage.addChild(new DialogBox());
    this.fixedCameraStage.addChild(new DialogOverlay());

    if (DebugFlags["Play Music"].on) {
      const audio = Assets.getResource("loop1");

      audio.play();
      audio.loop = true;
    }

    // if (DebugFlags["Show Initial Dialog"].on) {
      this.coroutineManager.startCoroutine(
        "Initial Cinematic",
        this.cinematics.openingCinematic(),
        this
      );
    // }
  };
}
