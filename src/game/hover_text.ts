import { Entity } from "../library/entity";
import { TextEntity } from "../library/text_entity";
import { IGameState } from "Library";

export class HoverText extends Entity {
  text  : TextEntity;
  shadow: TextEntity;

  constructor(text: string) {
    super({ name: "HoverText" });

    this.addChild(this.shadow = new TextEntity({
      text    : text,
      fontSize: 100,
      color   : "0x022a2e",
      width   : 700,
    }));

    this.shadow.x = 7;
    this.shadow.y = 7;

    this.addChild(this.text = new TextEntity({
      text    : text,
      fontSize: 100,
      width   : 700,
    }));
  }

  initialY: number | null = null;

  update(state: IGameState) {
    if (this.initialY === null) {
      this.initialY = this.y;
    }

    this.y = this.initialY + Math.sin(state.tick / 30) * 30;
  }
}