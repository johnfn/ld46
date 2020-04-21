import { BaseGameState } from "../library/base_state";
import { TextEntity } from "../library/text_entity";
import { GameCoroutine } from "../library/coroutine_manager";
import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Mode } from "Library";
import { DebugFlags } from "./debug";

export type DialogText = (
  | { speaker?: string; text: string; }
  | { 
      speaker?: string; 
      text    : string; 
      branches: { text: string; next: DialogText }[];
    }
)[];

export class DialogBox extends Entity {
  activeModes: Mode[] = ["Dialog", "Normal"] ;

  public static Instance: DialogBox;
  public static DialogVisible = () => DialogBox.Instance.visible;

  private dialogText: TextEntity;
  private speakerText: TextEntity;
  private profilePic: Entity;

  private branches: TextEntity[] = [];
  private graphic: Entity;

  constructor() {
    super({
      name: "DialogBox",
    });

    this.visible = false;
    
    this.x = 100;
    this.y = 550;

    this.graphic = new Entity({ 
      texture: Assets.getResource("dialog_box"),
      name: "Dialog Graphic",
    });

    this.graphic.width = 1200 * 2;
    this.graphic.height = 300 * 2;

    this.addChild(this.graphic);

    DialogBox.Instance = this;

    this.speakerText = new TextEntity({ text: "Name test", width: 900, height: 400, fontSize: 80, color: "orange" });
    this.speakerText.y = 20;
    this.speakerText.x = 90;

    this.addChild(this.speakerText);

    this.dialogText = new TextEntity({ text: "Line test", width: 1800, height: 800, fontSize: 80 });
    this.dialogText.y = 120;
    this.dialogText.x = 380;

    this.addChild(this.dialogText);

    this.profilePic = new Entity({ name: "profile pic" });
    this.profilePic.x      = -110;
    this.profilePic.y      = 90;
    this.profilePic.width  = 530;
    this.profilePic.height = 530;
    this.addChild(this.profilePic);

    for (let i = 0; i < 4; i++) {
      let branchText = new TextEntity({ text: "", width: 900, fontSize: 80 });

      this.branches.push(branchText);
      branchText.x = 100;
      branchText.y = 500 + i * 100;

      this.addChild(branchText);
    }
  }

  *startDialog(dialog: DialogText): GameCoroutine {
    let state: IGameState;

    if (DebugFlags["SKIP ALL DIALOG"]) { return; }

    state = yield "next";

    let oldMode = state.mode;
    let oldVisible = this.visible;

    this.visible = true;
    let activeDialogText = dialog.slice();

    state.mode = "Dialog";

    while (activeDialogText.length > 0) {
      const fullText = activeDialogText[0];

      if ('branches' in fullText) {
        this.graphic.height = 1000;
      } else {
        this.graphic.height = 600;

        this.branches[0].setText("");
        this.branches[1].setText("");
        this.branches[2].setText("");
        this.branches[3].setText("");
      }

      let textToShow = "";

      while (textToShow.length < fullText.text.length) {
        textToShow += fullText.text[textToShow.length];
        this.displayDialogContents(fullText.speaker || "", textToShow);

        state.sfx.playVoiceSound2(state.tick);

        if (state.keys.justDown.X) {
          textToShow = fullText.text;
          this.displayDialogContents(fullText.speaker || "", textToShow);

          state = yield "next";
      
          break;
        }

        state = yield "next";
      }

      if ('branches' in fullText) {
        this.displayBranches(fullText);

        while (true) {
          state = yield 'next';

          if (state.keys.justDown.A) { yield* this.startDialog(fullText.branches[0].next); break; }
          if (state.keys.justDown.S) { yield* this.startDialog(fullText.branches[1].next); break; }
          if (state.keys.justDown.D) { yield* this.startDialog(fullText.branches[2].next); break; }
          if (state.keys.justDown.F) { yield* this.startDialog(fullText.branches[3].next); break; }
        }
      } else {
        state = yield { untilKeyPress: "X" };
        state = yield "next"; // make sure x isnt justDown
      }

      activeDialogText.shift();
    }

    state.mode = oldMode;
    this.visible = oldVisible;
  }

  displayBranches(fullText: { speaker?: string | undefined; text: string; branches: { text: string; next: DialogText; }[]; }) {
    const keys = "ASDF";

    for (let i = 0; i < fullText.branches.length; i++) {
      const branch = fullText.branches[i];

      this.branches[i].setText(`${ keys[i] }: ${ branch.text }`);
    }
  }

  public static *StartDialog(dialog: DialogText): GameCoroutine {
    yield* DialogBox.Instance.startDialog(dialog.slice(0));
  }

  displayDialogContents(speaker: string, textToShow: string) {
    this.dialogText.setText(textToShow);

    if (speaker) {
      this.speakerText.setText(speaker);
    }

    // if (speaker === "Chief Nabisco") {
    //   this.profilePic.texture = Assets.getResource("oberon_portrait");
    // } else if (speaker === "Detective Pringle") {
    //   this.profilePic.texture = Assets.getResource("miranda_portrait");
    // } else if (speaker === "Tasukete") {
    //   this.profilePic.texture = Assets.getResource("tasukete_portrait");
    // }
  }

  update(state: BaseGameState): void { }
}