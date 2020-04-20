import { Entity } from "../library/entity";
import { TextEntity } from "../library/text_entity";
import { IGameState } from "Library";

export class HoverText extends Entity {
  text: TextEntity;

  constructor(text: string) {
    super({ name: "HoverText" });

    this.addChild(this.text = new TextEntity({
      text    : text,
      fontSize: 80,
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