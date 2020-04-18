import { CoroutineManager, GameCoroutine } from "../library/coroutine_manager";
import { Game } from "./game";
import { DialogOverlay } from "./dialog_overlay";
import { DialogTexts } from "./dialog_text";

export class Cinematics {
  coroutineManager: CoroutineManager;
  game            : Game;

  constructor(coroutineManager: CoroutineManager, game: Game) {
    this.coroutineManager = coroutineManager;
    this.game = game;
  }

  public *linearTween(props: {
    set   : (newValue: number) => void;
    start : number;
    stop  : number;
    frames: number;
  }): GameCoroutine {
    const { set, start, stop, frames } = props;

    set(start);
    yield "next";

    for (let i = 0; i < frames; i++) {
      const value = start + (i * (stop - start)) / frames;

      set(value);
      yield "next";
    }

    set(stop);
  }

  public *openingCinematic(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    state.overlay.alpha = 1;

    yield* DialogOverlay.StartDialog(DialogTexts.IntroText);
    yield* this.linearTween({
      set   : x => state.overlay.alpha = x,
      start : 1,
      stop  : 0,
      frames: 90,
    });

    state.mode = "Normal";
  }
}
