import { Entity } from "./entity";
import { TextEntity } from "./text_entity";
import { IGameState } from "Library";
import { Sprite, Geometry, Graphics, Texture } from "pixi.js";
import { Assets } from "../game/assets";
import { Vector2 } from "./geometry/vector2";
import { C } from "../game/constants";
import { Mode } from "Library";
import ReactDOM from 'react-dom';
import React from 'react';


export class TitleScreen extends Entity {
    activeModes: Mode[] = ["Menu"]
    state: "main" | "entername" = "main";
    graphic: Sprite;
    blackScreen: Entity;
    pressEnterText: TextEntity;
    enterYourNameText: TextEntity;
    startedGlowing: boolean = false;
    frame: number = 0;
    waitFrames: number = 120;

    constructor(textProps: {
        fontSize: number,
        width   : number,
      }) {
        super({name: "TitleScreen"});
        
        this.graphic = new Sprite()
        this.addChild(new Entity({name: "MenuBackground", texture: Assets.getResource("titlescreen")}))

        this.pressEnterText = new TextEntity({text: "(press enter you fool)", ... textProps});
        this.pressEnterText.position = new Vector2(C.CanvasWidth-480, C.CanvasHeight + 250)
        this.pressEnterText.alpha = 0;
        this.addChild(this.pressEnterText);

        this.blackScreen = new Entity({name: "BlackScreen", texture: Texture.WHITE});
        this.blackScreen.width = C.CanvasWidth*1.5;
        this.blackScreen.height = C.CanvasHeight*1.5;
        this.blackScreen.sprite.tint = 0x000000;
        this.blackScreen.visible = false;
        this.addChild(this.blackScreen);

        this.enterYourNameText = new TextEntity({text: "enter your name", ... textProps});
        this.enterYourNameText.position = new Vector2(C.CanvasWidth-410, C.CanvasHeight/2)
        this.enterYourNameText.visible = false;
        this.addChild(this.enterYourNameText);

        

    }

    update(state: IGameState) {
        if (state.keys.justDown.Enter) {
            if (this.state === "main") {
                this.blackScreen.visible = true;
                this.enterYourNameText.visible = true;
                ReactDOM.render(
                    <input 
                    type="text" 
                    size={4}
                    //autofocus="true"
                    style={{
                        "position": "absolute",
                        "border": "solid white 1px",
                        "left": C.CanvasWidth/2,
                        "top": C.CanvasHeight/2,
                    }}/>, 
                    document.getElementById('root')
                  );
            } else {
                this.parent?.removeChild(this)
                state.mode = "Normal";
            }
        }

        // Text glow
        this.frame += 1
        console.log(this.alpha)
        if (this.frame < this.waitFrames) return;

        if (this.pressEnterText.alpha > 0.5) this.startedGlowing = true;

        if (!this.startedGlowing) {
            this.pressEnterText.alpha = Math.sin((this.frame - this.waitFrames) / 200)
        } else {
            this.pressEnterText.alpha = 0.5 + (1 - Math.sin((this.frame - this.waitFrames) / 30))/4
        }
    }
}

