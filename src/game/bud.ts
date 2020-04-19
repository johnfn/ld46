import { Entity } from "../library/entity";
import { Assets } from "./assets";

export class Bud extends Entity {
  public static Instance: Bud;

  constructor() {
    super({
      name: "Bud",
    });

    this.texture = Assets.getResource("bud");

    Bud.Instance = this;
  }
}