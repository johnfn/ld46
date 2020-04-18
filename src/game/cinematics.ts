import { CoroutineManager, GameCoroutine } from "../library/coroutine_manager";
import { Game } from "./game";
import { DialogOverlay } from "./dialog_overlay";
import { TextEntity } from "../library/text_entity";
import { IGameState } from "Library";
import { DialogBox } from "./dialog_box";

export class Cinematics {
  coroutineManager   : CoroutineManager;
  game               : Game;
  spaceToContinueText: TextEntity;

  constructor(coroutineManager: CoroutineManager, game: Game) {
    this.coroutineManager = coroutineManager;
    this.game = game;
    this.spaceToContinueText = new TextEntity({
      text: "Press space to continue",
      fontSize: 15,
      width: 800,
    });

    this.game.fixedCameraStage.addChild(this.spaceToContinueText);
    this.spaceToContinueText.x = 400;
    this.spaceToContinueText.y = 600;

    this.spaceToContinueText.visible = false;
  }

  public *linearTween(props: {
    set   : (newValue: number) => void;
    start : number;
    stop  : number;
    frames: number;
  }): GameCoroutine {
    const { set, start, stop, frames } = props;

    if (frames === 0) {
      set(stop);
      return;
    }

    set(start);
    yield "next";

    for (let i = 0; i < frames; i++) {
      const value = start + (i * (stop - start)) / frames;

      set(value);
      yield "next";
    }

    set(stop);
  }

  public *fadeScreenToPercentage(props: { percentage: number; time: number; state: IGameState }): GameCoroutine {
    const { percentage, time, state } = props;

    yield* this.linearTween({
      set   : x => state.overlay.alpha = x,
      start : state.overlay.alpha,
      stop  : percentage / 100,
      frames: time,
    });
  }

  public *openingCinematic(): GameCoroutine {
    let state = yield "next"; // Wait for one frame.

    state.mode = "Dialog"; // Set game mode to dialog. This means that the player can't move etc

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state }); // Fade the screen to 100% faded, taking 0 frames (time). state always has to be there

    this.spaceToContinueText.visible = true; // Show the "space to continue" text

    yield* DialogOverlay.StartDialog([ // Start the following dialog
      { speaker: "Herald", text: "...", }, // First dialog: speaker name is Herald, text is "..."
      { speaker: "Herald", text: ".........", }, // second dialog
      { speaker: "Herald", text: "...huh?", }, // etc
      { speaker: "Herald", text: "Where am I?", },
      { speaker: "Herald", text: "...who am I?", },
      { speaker: "Herald", text: "And why does my body feel like it’s been asleep for, like, five hundred years?", },
    ]);

    this.spaceToContinueText.visible = false; // hide space to continue text

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); // Fade the screen to 0% faded over 90 frames. 

    state.mode = "Normal"; // Set game state back to normal so the player can play the game
  }

  public *openingBud(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state });

    this.spaceToContinueText.visible = true; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Sigh… Another day, another lonely diary entry.", },
      { speaker: "Bud", text: "Dear diary…", },
      { speaker: "Bud", text: "I hope you’re doing well today!", },
      { speaker: "Bud", text: "Me? Oh, thanks for asking!", },
      { speaker: "Bud", text: "It’s been the same as every other day, I suppose.", },
      { speaker: "Bud", text: "Wake up, brush my wings, and stand guard over the sprite!", },
      { speaker: "Bud", text: "I can’t complain. I have stability and routine. What more could I want?", },
      { speaker: "Bud", text: "…I sure do hope he wakes up someday, though.", },
      { speaker: "Bud", text: "Huh? What’s that?", },
      { speaker: "Bud", text: "You want me to turn around?", },
      { speaker: "Bud", text: "What a silly book! Why would I want to do that?", },
    ]);

    this.spaceToContinueText.visible = false; // hide space to continue text

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); // Fade the screen to 0% faded over 90 frames. 

    state.mode = "Normal"; // Set game state back to normal so the player can play the game
  }
}
