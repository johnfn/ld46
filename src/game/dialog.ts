import { BaseGameState } from "../library/base_state";
import { TextEntity } from "../library/text_entity";
import { GameCoroutine } from "../library/coroutine_manager";
import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Mode } from "Library";

export type DialogText = {
  speaker: string;
  text   : string;
}[];

export class DialogBox extends Entity {
  activeModes: Mode[] = ["Dialog", "Normal"] ;

  public static Instance: DialogBox;
  public static DialogVisible = () => DialogBox.Instance.visible;

  private activeDialogText: DialogText = [];
  private dialogText: TextEntity;
  private speakerText: TextEntity;
  private profilePic: Entity;

  constructor() {
    super({
      name: "DialogBox",
    });

    this.visible = false;
    
    this.x = 100;
    this.y = 550;

    const graphic = new Entity({ 
      texture: Assets.getResource("dialog_box"),
      name: "Dialog Graphic",
    });

    graphic.width = 1400;
    graphic.height = 500;
    this.addChild(graphic);

    DialogBox.Instance = this;

    this.speakerText = new TextEntity({ text: "Name test", width: 900, height: 400, fontSize: 60, color: "orange"});
    this.speakerText.y = 30;
    this.speakerText.x = 90;

    this.addChild(this.speakerText);

    this.dialogText = new TextEntity({ text: "Line test", width: 900, height: 400, fontSize: 40});
    this.dialogText.y = 120;
    this.dialogText.x = 380;

    this.addChild(this.dialogText);

    this.profilePic = new Entity({ name: "profile pic" });
    this.profilePic.x      = -110;
    this.profilePic.y      = 90;
    this.profilePic.width  = 530;
    this.profilePic.height = 530;
    this.addChild(this.profilePic);
  }

  *startDialog(dialog: DialogText): GameCoroutine {
    this.visible = true;
    this.activeDialogText = dialog;

    let state: IGameState;

    state = yield "next";

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

      state.mode = "Normal";

      this.activeDialogText.shift();
    }

    this.visible = false;
  }

  public static *StartDialog(dialog: DialogText): GameCoroutine {
    yield* DialogBox.Instance.startDialog(dialog.slice(0));
  }

  displayDialogContents(textToShow: string) {
    const speaker = this.activeDialogText[0].speaker;

    this.dialogText.setText(textToShow);
    this.speakerText.setText(speaker);

    if (speaker === "Chief Nabisco") {
      this.profilePic.texture = Assets.getResource("oberon_portrait");
    } else if (speaker === "Detective Pringle") {
      this.profilePic.texture = Assets.getResource("miranda_portrait");
    } else if (speaker === "Tasukete") {
      this.profilePic.texture = Assets.getResource("tasukete_portrait");
    }
  }

  update(state: BaseGameState): void { }
}