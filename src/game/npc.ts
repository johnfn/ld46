import { Entity } from "../library/entity";
import { IGameState } from "Library";
import { Texture, Graphics } from "pixi.js";
import { Rect } from "../library/geometry/rect";
import { TextEntity } from "../library/text_entity";
import { HoverText } from "./hover_text";
import { C } from "./constants";
import { Mode } from "Library";
import { Assets } from "./assets";
import { Vector2 } from "../library/geometry/vector2";
import { GameCoroutine } from "../library/coroutine_manager";

export type NpcDialogType = { speaker: Entity; text: string }[];

export class NpcDialog extends Entity {
  activeModes: Mode[] = ["Normal", "Dialog"];

  public static Instance: NpcDialog;

  graphic      : Graphics;
  text         : TextEntity;
  dialogHeight = 120;

  constructor() {
    super({ 
      name   : "NpcDialogParent", 
    });

    this.text = new TextEntity({
      text    : "",
      fontSize: 80,
      width   : 2000,
    });

    const yOffset = 200;

    this.graphic = new Graphics();
    this.graphic.x = 0;
    this.graphic.y = yOffset;
    this.drawDialogBox("LALALALALA");

    this.sprite.addChild(this.graphic);
    this.visible = false;

    const tip = new Entity({ name: "DialogTip", texture: Assets.getResource("dialog_tip") });
    tip.scale = new Vector2(0.25, 0.25);

    this.addChild(tip, 20, this.dialogHeight + yOffset);
    this.addChild(this.text, 20, 10 + yOffset);

    NpcDialog.Instance = this;
  }

  private drawDialogBox(text: string): void {
    let wid = this.text.calculateTextWidth(text);

    if (wid > 2000) {
      wid = 2000;
      this.dialogHeight = 120 * 4;
    } else {
      this.dialogHeight = 120;
    }

    this.graphic.clear();
    this.graphic.beginFill(0x0);
    this.graphic.drawRoundedRect(0, 0, wid + 100, this.dialogHeight, 40);
    this.graphic.endFill();
  }

  public static *StartDialog(dialog: NpcDialogType): GameCoroutine {
    yield* NpcDialog.Instance.initiateDialog(dialog);
  }

  public *initiateDialog(dialog: NpcDialogType): GameCoroutine {
    yield* this.writeDialog(dialog);
  }

  *writeDialog(dialogs: NpcDialogType): GameCoroutine {
    let state = yield "next";

    this.visible = true;

    for (const dialog of dialogs) {
      let textSoFar = "";
      let fullText = dialog.text;

      state.mode = "Dialog";

      this.drawDialogBox(fullText);
      this.visible = true;
      this.x = dialog.speaker.x;
      this.y = dialog.speaker.y - 512;

      while (textSoFar.length < fullText.length) {
        textSoFar += fullText[textSoFar.length];
        this.text.setText(textSoFar);

        state = yield "next";

        if (state.keys.justDown.X) {
          break;
        }
      }

      textSoFar = fullText;
      this.text.setText(textSoFar);

      yield { untilKeyPress: "X" };
    }

    state.mode = "Normal";

    this.visible = false;
  }

  update(state: IGameState) {

  }
}

export class Npc extends Entity {
  activeModes: Mode[] = ["Normal"];
  hoverText: HoverText;
  interactionDistance = C.InteractionDistance;
  dialogName: string = "";

  graphic: Entity;

  initialY = -512;

  constructor(props: { [key: string]: unknown }, x: number, y: number ) {
    super({ 
      name      : "Npc",
      collidable: String(props["collideable"]) === "true",
    });

    let path = props["imagepath"];

    if (!path) {
      path = "npc1";

      console.error("interactable without type", this);
    }

    const tex: unknown = Assets.getResource(path as any);

    if (!(tex instanceof Texture)) {
      throw new Error(`Interactable at x ${ x } y ${ y } had path ${ path } which either doesnt exist or isnt a standalone image. animations (imgs that end in numbers) dont work currently but grant might fix that. anyway the point is, go fix it?`);
    }

    this.graphic = new Entity({ name: "NpcName", texture: tex });
    this.graphic.y = this.initialY;
    this.addChild(this.graphic);

    this.dialogName = props["dialog"] as string;

    this.addChild(this.hoverText = new HoverText("x: interact"), 0, -550);
    this.hoverText.visible = false;
  }

  public collisionBounds(): Rect {
    return new Rect({
      x     : 0,
      y     : 0,
      width : 256,
      height: 256,
    })
  }

  update(state: IGameState) { 
    this.graphic.y = this.initialY + Math.sin(state.tick / 400) * 40;

    // if (this.npcDialog) {
    //   if (state.keys.justDown.X) {
    //     this.hoverText.visible = false;
    //     state.mode = "Normal";

    //     this.removeChild(this.npcDialog);
    //     this.npcDialog = null;
    //   }
    // } else {
    if (state.player.position.distance(this.position) < this.interactionDistance) {
      this.hoverText.visible = true;

      if (state.keys.justDown.X) {
        this.startCoroutine(
          this.dialogName,
          (state.cinematics as any)[this.dialogName](this)
        );
      }
    } else {
      this.hoverText.visible = false;
    }
    // }
  }
}