import { Entity } from "./entity";
import { TextEntity } from "./text_entity";
import { IGameState } from "Library";
import { Sprite } from "pixi.js";
import { Assets } from "../game/assets";
import { Vector2 } from "./geometry/vector2";
import { C } from "../game/constants";

export class TitleScreen extends Entity {
    graphic: Sprite;
    text: TextEntity;
    startedGlowing: boolean = false;
    frame: number = 0;
    waitFrames: number = 60;

    constructor(textProps: {
        text    : string,
        fontSize: number,
        width   : number,
      }) {
        super({name: "TitleScreen"});
        
        this.graphic = new Sprite()
        this.addChild(new Entity({name: "MenuBackground", texture: Assets.getResource("titlescreen")}))
        this.text = new TextEntity(textProps);
        this.addChild(this.text)
        this.text.alpha = 0;
        this.text.position = new Vector2(2*C.CanvasWidth - 260, 3.5*C.CanvasHeight)

    }

    update(state: IGameState) {

        // Text glow
        this.frame += 1
        if (this.frame < this.waitFrames) return;

        if (this.text.alpha > 0.5) this.startedGlowing = true;

        if (!this.startedGlowing) {
            this.text.alpha = Math.sin((this.frame - this.waitFrames) / 200)
        } else {
            this.text.alpha = 0.5 + (1 - Math.sin((this.frame - this.waitFrames) / 60))/4
        }
      
        
    }
}

