import { BaseGame } from "../library/base_game";
import { AssetsToLoad, Assets } from "./assets";
import { Player } from "./player";
import { GameMap } from "./game_map";
import { DialogBox } from "./dialog";
import { DebugFlags } from "./debug";
import { GameState } from "./state";

export class Game extends BaseGame<typeof AssetsToLoad> {
  public static Instance: Game;

  constructor() {
    super({
      canvasWidth : 1024,
      canvasHeight: 768,
      tileWidth   : 256,
      tileHeight  : 256,
      scale       : 0.25,
      assets      : Assets,
      debugFlags  : DebugFlags,
      state       : new GameState()
    });

    Game.Instance = this;
  }

  initialize() {
    this.stage.addChild(new GameMap());
    this.stage.addChild(this.state.player = new Player());

    this.fixedCameraStage.addChild(new DialogBox());

    if (DebugFlags["Play Music"].on) {
      const audio = Assets.getResource("loop1");

      audio.play();
      audio.loop = true;
    }

    // if (DebugFlags["Show Initial Dialog"].on) {
      // this.coroutineManager.startCoroutine(
      //   "Initial Dialog",
      //   DialogBox.StartDialog(DialogTexts.IntroText)
      // );
    // }
  };
}
