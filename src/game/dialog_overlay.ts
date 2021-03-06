import { BaseGameState } from "../library/base_state";
import { TextEntity } from "../library/text_entity";
import { GameCoroutine } from "../library/coroutine_manager";
import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Mode } from "Library";
import { DebugFlags } from "./debug";

export type DialogText = {
  speaker: string;
  text   : string;
}[];

export class DialogOverlay extends Entity {
  activeModes: Mode[] = ["Dialog", "Normal"] ;

  public static Instance: DialogOverlay;
  public static DialogVisible = () => DialogOverlay.Instance.visible;

  private activeDialogText: DialogText = [];
  private dialogText: TextEntity;

  constructor() {
    super({
      name: "Dialog Overlay",
    });

    this.visible = false;
    
    this.x = 0;
    this.y = 0;

    DialogOverlay.Instance = this;

    this.dialogText = new TextEntity({ text: "", width: 2000, height: 2000, fontSize: 30 * 4 });
    this.dialogText.y = 220 * 4;
    this.dialogText.x = 200 * 4;

    this.addChild(this.dialogText);
  }

  *startDialog(dialog: DialogText): GameCoroutine {
    this.visible = true;
    this.activeDialogText = dialog.slice();

    let state: IGameState;

    state = yield "next";

    let oldMode = state.mode;
    state.mode = "Dialog";

    while (this.activeDialogText.length > 0) {
      const fullText = this.activeDialogText[0];
      let textToShow = "";

      while (textToShow.length < fullText.text.length) {
        textToShow += fullText.text[textToShow.length];
        this.displayDialogContents(textToShow);

        state.sfx.playVoiceSound3(state.tick);

        if (state.keys.justDown.X) {
          textToShow = fullText.text;
          this.displayDialogContents(textToShow);

          state = yield "next";
      
          break;
        }

        state = yield "next";
      }

      state = yield { untilKeyPress: "X" };
      state = yield "next"; // make sure z isnt justDown

      this.activeDialogText.shift();

      textToShow = "";
    }

    state.mode = oldMode;

    this.visible = false;
  }

  public static *StartDialog(dialog: DialogText): GameCoroutine {
    if (DebugFlags["SKIP ALL DIALOG"]) { return; }
    DialogOverlay.Instance.clearDialogContents();
    yield {frames: 20}
    yield* DialogOverlay.Instance.startDialog(dialog.slice(0));
  }

  displayDialogContents(textToShow: string) {
    this.dialogText.setText(textToShow);
  }

  clearDialogContents() {
    this.dialogText.setText(" ");
  }

  update(state: BaseGameState): void { }
}