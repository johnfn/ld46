import { Entity } from "../library/entity";
import { Assets } from "./assets";
import { IGameState } from "Library";


class SpiritMeter extends Entity {
  icons: Entity[] = [];
  blackBackground: Entity;

  constructor(spiritTotal: number) {
    super({ name: "SpiritMeter" });

    this.blackBackground = new Entity({ 
      texture: Assets.getResource("spirit_bg_hud"),
      name: "Dialog Graphic",
    })
    this.addChild(this.blackBackground);
    this.blackBackground.sprite.alpha = 0.8
    this.blackBackground.sprite.scale.x = 2.5 / 1.1;
    this.blackBackground.sprite.scale.y = 2 / 1.1;
    this.blackBackground.sprite.pivot.x = 0.5;
    this.blackBackground.sprite.pivot.y = 0.5;
    this.blackBackground.sprite.rotation = -0.07;
    this.blackBackground.x = -140;
    this.blackBackground.y = -20;

    for (let i = 0; i < 10; i++) {
      const icon = new Entity({
        name: "SpiritIcon"
      });

      
      this.icons.push(icon);
      this.addChild(icon);

      icon.x = 80 + i * 280;
      icon.y = 80 + i * - 10;   

      icon.texture = Assets.getResource("spirit_full_hud");

      // icon.sprite.pivot = new PIXI.Point(0.5, 0.5);
      icon.visible = false;
    }
  }

  update(state: IGameState) {
    for (let i = 0; i < state.spiritTotal; i++) {
      if (i < state.spiritUnused) {
        this.icons[i].texture = Assets.getResource("spirit_full_hud");
      } else {
        this.icons[i].texture = Assets.getResource("spirit_empty_hud");
        // this.icons[i].sprite.scale.x = 1.1;
        // this.icons[i].sprite.scale.y = 1.1;
      }

      const isaudsgksdfjg = Math.sin(state.tick / 35) * 0.016;
      this.icons[i].sprite.scale.x = 1.2 + isaudsgksdfjg;
      this.icons[i].sprite.scale.y = 1.2 + isaudsgksdfjg;

      this.icons[i].visible = true;
    }
    this.blackBackground.sprite.rotation = -0.04 + Math.sin(state.tick / 40) * 0.007;
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