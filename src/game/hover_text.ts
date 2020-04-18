import { Entity } from "../library/entity";
import { TextEntity } from "../library/text_entity";

export class HoverText extends Entity {
  text: TextEntity;

  constructor(text: string) {
    super({ name: "HoverText" });

    this.addChild(this.text = new TextEntity({
      text    : text,
      fontSize: 60,
    }));
  }
}