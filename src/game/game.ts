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
import { Sfx } from "./sfx";
import { Withers } from "./withers";
import { TitleScreen } from "../library/title_screen";
import { ParallaxLayers } from "./parallax_layers";

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
        budFollowing   : DebugFlags["Fairy Follows You Immediately"],
        haveVinePerma  : DebugFlags["Have Vine Perma"],
        haveShroomPerma: DebugFlags["Have Shroom Perma"],

        // These are set later.
        sfx          : undefined as any,
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
    this.stage.addChild(this.state.map = new GameMap(this.state));
    this.stage.addChild(this.state.player = new Player());
    this.stage.addChild(this.state.sfx = new Sfx());

    this.parallaxStage.addChild(new ParallaxLayers());

    this.fixedCameraStage.addChild(this.state.overlay = new Overlay());
    this.fixedCameraStage.addChild(new DialogBox());
    this.fixedCameraStage.addChild(new DialogOverlay());
    this.fixedCameraStage.addChild(new Hud(this.state.spiritTotal));
    this.stage.addChild(new NpcDialog());

    this.stage.addChild(new Withers());

    if (DebugFlags["Show Menu"]) {
      this.state.mode = "Menu";
      const titlescreen = new TitleScreen({
        fontSize: 40,
        width   : 700,
      });

      titlescreen.sprite.scale.set(8/3)
      this.fixedCameraStage.addChild(titlescreen)
    } else {
      if (DebugFlags["Show Initial Cinematic"]) {
        this.coroutineManager.startCoroutine(
          "Initial Cinematic",
          this.cinematics.openingCinematic(),
          this
        );
      }
    }
  }
}
