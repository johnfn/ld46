import { VanishingEntity } from "./vanishing_entity";
import { TextEntity } from "../library/text_entity";
import { Texture } from "pixi.js";
import { Entity } from "../library/entity";
import { Assets } from "./assets";
import { IGameState } from "Library";

export class GenericItem extends VanishingEntity {
  floatingText: TextEntity;
  graphic: Entity;

  constructor(tex: Texture, description: string) {
    super({
      name   : "bookshelfRoot",
      texture: tex,
    });

    this.graphic = new Entity({ 
      texture: Assets.getResource("dialog_box"),
      name   : "Graphic",
    });

    this.addChild(this.graphic);
    this.graphic.y = -250;
    this.graphic.alpha = 0.5;
    this.graphic.zIndex = 499;

    this.floatingText = new TextEntity({ text: description });
    this.floatingText.y = -250;
    this.floatingText.zIndex = 500;

    this.addChild(this.floatingText);

    this.floatingText.visible = false;
    this.graphic.visible = false;
  }

  update(state: IGameState): void {
    this.floatingText.visible = state.player.position.distance(this.position) < 200;
    this.graphic.visible = state.player.position.distance(this.position) < 200;
  }
}