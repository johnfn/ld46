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

export class NpcDialog extends Entity {
  graphic: Graphics;
  text   : TextEntity;

  constructor() {
    super({ name: "NpcDialogParent" });

    this.text = new TextEntity({
      text    : "LALA LALAL LAAAAAAAAAA",
      fontSize: 80,
      width   : 5000,
    });

    const wid = this.text.calculateTextWidth();
    const height = 120;

    this.graphic = new Graphics();
    this.graphic.beginFill(0x0);
    this.graphic.drawRoundedRect(0, 0, wid + 40, height, 40);

    this.sprite.addChild(this.graphic);

    const ent = new Entity({ name: "DialogTip", texture: Assets.getResource("dialog_tip") });
    ent.scale = new Vector2(0.25, 0.25);
    this.addChild(
      ent,
      20,
      height
    );

    this.addChild(this.text, 20, 10);
  }

  update(state: IGameState) {

  }
}

export class Npc extends Entity {
  activeModes: Mode[] = ["Normal", "Dialog"];
  hoverText: HoverText;
  interactionDistance = C.InteractionDistance;
  npcDialog: NpcDialog | null;

  constructor(
    tempTex: Texture // need better 1
  ) {
    super({ 
      name      : "Npc",
      texture   : tempTex,
      collidable: true,
    });

    this.npcDialog = null;
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
    if (this.npcDialog) {
      if (state.keys.justDown.X) {
        this.hoverText.visible = false;
        state.mode = "Normal";

        this.removeChild(this.npcDialog);
        this.npcDialog = null;
      }
    } else {
      if (state.player.position.distance(this.position) < this.interactionDistance) {
        this.hoverText.visible = true;

        if (state.keys.justDown.X) {
          state.mode = "Dialog";
          this.addChild(this.npcDialog = new NpcDialog(), 0, -200);
        }
      } else {
        this.hoverText.visible = false;
      }
    }
  }
}