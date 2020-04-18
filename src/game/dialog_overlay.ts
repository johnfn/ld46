import { BaseGameState } from "../library/base_state";
import { TextEntity } from "../library/text_entity";
import { GameCoroutine } from "../library/coroutine_manager";
import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Mode } from "Library";
import { C } from "./constants";

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
      name: "DialogBox",
    });

    this.visible = false;
    
    this.x = 100;
    this.y = 550;

    DialogOverlay.Instance = this;

    this.dialogText = new TextEntity({ text: "dialog overlay text", width: 900, height: 400, fontSize: 15 * C.Scale});
    this.dialogText.y = 120;
    this.dialogText.x = 380;

    this.addChild(this.dialogText);
  }

  *startDialog(dialog: DialogText): GameCoroutine {
    this.visible = true;
    this.activeDialogText = dialog;

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

        if (state.keys.justDown.Spacebar) {
          textToShow = fullText.text;
          this.displayDialogContents(textToShow);

          state = yield "next";
      
          break;
        }

        state = yield "next";
      }

      state = yield { untilKeyPress: "Spacebar" };

      state.mode = oldMode;

      this.activeDialogText.shift();
    }

    this.visible = false;
  }

  public static *StartDialog(dialog: DialogText): GameCoroutine {
    yield* DialogOverlay.Instance.startDialog(dialog.slice(0));
  }

  displayDialogContents(textToShow: string) {
    this.dialogText.setText(textToShow);
  }

  update(state: BaseGameState): void { }
}