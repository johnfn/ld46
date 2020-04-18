import { Texture } from "pixi.js";

import { DialogBox } from "./dialog";
import { GameCoroutine } from "../library/coroutine_manager";
import { Entity } from "../library/entity";

export abstract class VanishingEntity extends Entity {
  constructor(props: {
    name     : string,
    texture ?: Texture;
  }) {
    super({
      ...props,
      collidable: true,
    });

    const content = new Entity({
      name   : "VanishingEntity",
      texture: props.texture,
    })

    content.sprite.interactive = true;
    this.addChild(content);

    this.addOnClick(() => {
      this.startCoroutine("Remove Entity", this.removeEntity());
    });
  }

  texts = [
    {
      before: [ { speaker: "Detective Pringle", text: "You try to investigate it. As you reach out your hand to touch it… Huh?" } ],
      after: [ { speaker: "Detective Pringle", text: "What? It… disappeared? How did that happen?", } ],
    },

    {
      before: [ { speaker: "Detective Pringle", text: "You try to investigate it. You reach out your hand carefully…", } ],
      after: [ { speaker: "Detective Pringle", text: "Again?? Where the hell did it go?", } ],
    },

    {
      before: [ { speaker: "Detective Pringle", text: "With trepidation, you reach out your hand to touch it.", } ],
      after: [ { speaker: "Detective Pringle", text: "Yikes. Were the owners of this house magicians or something?", }
      ],
    },

    {
      before: [ { speaker: "Detective Pringle", text: "At this point, you know what’s going to happen.", },
                { speaker: "Detective Pringle", text: "...but you have to TRY, right?" }
      ],
      after: [ { speaker: "Detective Pringle", text: "Hmm. Looks like your actions have consequences.", } ],
    },

    {
      before: [ { speaker: "Detective Pringle", text: "Might as well try.", } ],
      after: [ { speaker: "Detective Pringle", text: "...and there it goes.", } ],
    },
  ];

  public static index = -1;

  *removeEntity(): GameCoroutine {
    VanishingEntity.index++;
    if (VanishingEntity.index > 4) { VanishingEntity.index = 4; }

    const { before, after } = this.texts[VanishingEntity.index];

    yield* DialogBox.StartDialog(before);

    this.sprite.parent.removeChild(this.sprite);

    // yield { frames: 20 };

    yield* DialogBox.StartDialog(after);

    this.setCollideable(false);
  }
}