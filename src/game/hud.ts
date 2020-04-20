import { Entity } from "../library/entity";
import { Assets } from "./assets";
import { IGameState } from "Library";

class SpiritMeter extends Entity {
  icons: Entity[] = [];

  constructor(spiritTotal: number) {
    super({ name: "SpiritMeter" });

    for (let i = 0; i < 10; i++) {
      const icon = new Entity({
        name: "SpiritIcon"
      });

      this.icons.push(icon);
      this.addChild(icon);

      icon.x = i * 256;
      icon.y = 0;

      icon.texture = Assets.getResource("spirit_full_hud");

      icon.visible = false;
    }
  }

  update(state: IGameState) {
    for (let i = 0; i < state.spiritTotal; i++) {
      if (i < state.spiritUnused) {
        this.icons[i].texture = Assets.getResource("spirit_full_hud");
      } else {
        this.icons[i].texture = Assets.getResource("spirit_empty_hud");
      }

      this.icons[i].visible = true;
    }
  }
}

export class Hud extends Entity {
  constructor(spiritTotal: number) {
    super({
      name: "HUD",
    });
    const sm = new SpiritMeter(spiritTotal)

    //aesthetics
    sm.sprite.scale.set(1.4)
    sm.position = sm.position.add({x:70, y:30})
    
    this.addChild(sm);
  }
}