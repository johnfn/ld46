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
      width   : 5000,
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
    const wid = this.text.calculateTextWidth(text);

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

  *writeDialog(dialog: NpcDialogType): GameCoroutine {
    let state = yield "next";

    let textSoFar = "";
    let fullText = dialog[0].text;

    state.mode = "Dialog";

    this.drawDialogBox(fullText);
    this.visible = true;
    this.x = dialog[0].speaker.x;
    this.y = dialog[0].speaker.y;

    while (textSoFar.length < fullText.length) {
      textSoFar += fullText[textSoFar.length];
      this.text.setText(textSoFar);

      state = yield "next";
    }

    yield { untilKeyPress: "X" }

    state.mode = "Normal";
  }

  update(state: IGameState) {

  }
}

export class Npc extends Entity {
  activeModes: Mode[] = ["Normal"];
  hoverText: HoverText;
  interactionDistance = C.InteractionDistance;
  dialogName: string = "";

  constructor(
    tempTex: Texture, // need better 1
    props: { [key: string]: unknown }
  ) {
    super({ 
      name      : "Npc",
      texture   : tempTex,
      collidable: true,
    });

    this.dialogName = props["dialog"] as string;

    this.addChild(this.hoverText = new HoverText("x: interact"), 0, -80);
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