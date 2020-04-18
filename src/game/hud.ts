import { Entity } from "../library/entity";
import { Assets } from "./assets";
import { C } from "./constants";
import { IGameState } from "Library";

class SpiritMeter extends Entity {
  icons: Entity[] = [];

  constructor(spiritTotal: number) {
    super({ name: "SpiritMeter" });

    for (let i = 0; i < spiritTotal; i++) {
      const icon = new Entity({
        name: "SpiritIcon"
      });

      this.icons.push(icon);
      this.addChild(icon);

      icon.x = i * 256 * C.Scale.x;
      icon.y = 0;

      icon.texture = Assets.getResource("spirit_full_hud");
      icon.scale = C.Scale;
    }
  }

  update(state: IGameState) {
    for (let i = 0; i < state.spiritTotal; i++) {
      if (i < state.spiritUnused) {
        this.icons[i].texture = Assets.getResource("spirit_full_hud");
      } else {
        this.icons[i].texture = Assets.getResource("spirit_empty_hud");
      }
    }
  }
}

export class Hud extends Entity {
  constructor(spiritTotal: number) {
    super({
      name: "HUD",
    });

    this.addChild(new SpiritMeter(spiritTotal));
  }
}