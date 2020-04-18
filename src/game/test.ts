import { Assets } from "./assets";
import { Entity } from "../library/entity";
import { IGameState } from "Library";

export class Test extends Entity {
  constructor() {
    super({
      name: "Bookshelf",
    });

    const bookshelf = new Entity({
      texture: Assets.getResource("tileset"),
      name: "BookshelfTestGraphics",
    });

    bookshelf.x      = 0;
    bookshelf.y      = 0;
    bookshelf.width  = 50;
    bookshelf.height = 50;

    this.addChild(bookshelf);

    // const text = new TextEntity("This is a test of a text");

    // this.addChild(text);
  }

  update(state: IGameState): void {

  }
}