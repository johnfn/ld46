import { Entity } from "./entity";
import { TextEntity } from "./text_entity";
import { IGameState } from "Library";
import { Sprite, Geometry, Graphics } from "pixi.js";
import { Assets } from "../game/assets";
import { Vector2 } from "./geometry/vector2";
import { C } from "../game/constants";

export class TitleScreen extends Entity {
    state: "main" | "entername" = "main";
    graphic: Sprite;
    blackScreen: Entity;
    pressEnterText: TextEntity;
    enterYourNameText: TextEntity;
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

        this.pressEnterText = new TextEntity(textProps);
        this.pressEnterText.alpha = 0;
        this.pressEnterText.position = new Vector2(2*C.CanvasWidth - 260, 3.5*C.CanvasHeight)
        this.addChild(this.pressEnterText);

        this.blackScreen = new Entity({name: "BlackScreen", texture:PIXI.Texture.WHITE));
        this.blackScreen.width = C.CanvasWidth;
        this.blackScreen.height = C.CanvasHeight;
        this.blackScreen.sprite.tint = 0x000000;
        this.blackScreen.visible = false;
        this.addChild(this.blackScreen);

        this.enterYourNameText = new TextEntity(textProps);
        this.enterYourNameText.visible = false;
        this.addChild(this.enterYourNameText);

        

    }

    update(state: IGameState) {

        if (state.keys.justDown.Enter) {
            if (this.state === "main") {
                this.blackScreen.visible = true;
                this.enterYourNameText.visible = true;
            } else {
                this.parent?.removeChild(this)
                state.mode = "Normal";
            }
        }

        // Text glow
        this.frame += 1
        if (this.frame < this.waitFrames) return;

        if (this.pressEnterText.alpha > 0.5) this.startedGlowing = true;

        if (!this.startedGlowing) {
            this.pressEnterText.alpha = Math.sin((this.frame - this.waitFrames) / 200)
        } else {
            this.pressEnterText.alpha = 0.5 + (1 - Math.sin((this.frame - this.waitFrames) / 60))/4
        }
      
        
    }
}

