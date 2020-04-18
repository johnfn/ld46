import { CoroutineManager, GameCoroutine } from "../library/coroutine_manager";
import { Game } from "./game";
import { DialogOverlay } from "./dialog_overlay";
import { TextEntity } from "../library/text_entity";
import { IGameState } from "Library";
import { DialogBox } from "./dialog_box";

export class Cinematics {
  coroutineManager   : CoroutineManager;
  game               : Game;
  spaceToContinueText: TextEntity;

  constructor(coroutineManager: CoroutineManager, game: Game) {
    this.coroutineManager = coroutineManager;
    this.game = game;
    this.spaceToContinueText = new TextEntity({
      text: "Press SPACE to continue",
      fontSize: 15,
      width: 800,
    });

    this.game.fixedCameraStage.addChild(this.spaceToContinueText);
    this.spaceToContinueText.x = 400;
    this.spaceToContinueText.y = 600;

    this.spaceToContinueText.visible = false;
  }

  public *linearTween(props: {
    set   : (newValue: number) => void;
    start : number;
    stop  : number;
    frames: number;
  }): GameCoroutine {
    const { set, start, stop, frames } = props;

    if (frames === 0) {
      set(stop);
      return;
    }

    set(start);
    yield "next";

    for (let i = 0; i < frames; i++) {
      const value = start + (i * (stop - start)) / frames;

      set(value);
      yield "next";
    }

    set(stop);
  }

  public *fadeScreenToPercentage(props: { percentage: number; time: number; state: IGameState }): GameCoroutine {
    const { percentage, time, state } = props;

    yield* this.linearTween({
      set   : x => state.overlay.alpha = x,
      start : state.overlay.alpha,
      stop  : percentage / 100,
      frames: time,
    });
  }

  public *openingCinematic(): GameCoroutine {
    let state = yield "next"; // Wait for one frame.

    state.mode = "Dialog"; // Set game mode to dialog. This means that the player can't move etc

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state }); // Fade the screen to 100% faded, taking 0 frames (time). state always has to be there

    this.spaceToContinueText.visible = true; // Show the "space to continue" text

    yield* DialogOverlay.StartDialog([ // Start the following dialog
      { speaker: "Herald", text: "...", }, // First dialog: speaker name is Herald, text is "..."
      { speaker: "Herald", text: ".........", }, // second dialog
      { speaker: "Herald", text: "...huh?", }, // etc
      { speaker: "Herald", text: "Where am I?", },
      { speaker: "Herald", text: "...who am I?", },
      { speaker: "Herald", text: "And why does my body feel like it’s been asleep for, like, five hundred years?", },
    ]);

    this.spaceToContinueText.visible = false; // hide space to continue text

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); // Fade the screen to 0% faded over 90 frames. 

    state.mode = "Normal"; // Set game state back to normal so the player can play the game
  }

  public *openingBud(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state });

    this.spaceToContinueText.visible = true; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Sigh… Another day, another lonely diary entry.", },
      { speaker: "Bud", text: "Dear diary…", },
      { speaker: "Bud", text: "I hope you’re doing well today!", },
      { speaker: "Bud", text: "Me? Oh, thanks for asking!", },
      { speaker: "Bud", text: "It’s been the same as every other day, I suppose.", },
      { speaker: "Bud", text: "Wake up, brush my wings, and stand guard for the whole day!", },
      { speaker: "Bud", text: "I can’t complain. I have stability and routine. What more could I want?", },
      { speaker: "Bud", text: "…I sure do hope he wakes up someday, though.", },
      { speaker: "Bud", text: "Huh? What’s that?", },
      { speaker: "Bud", text: "You want me to turn around?", },
      { speaker: "Bud", text: "What a silly book! Why would I want to do that?", },
    ]);

    this.spaceToContinueText.visible = false; 

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); 

    state.mode = "Normal"; 
  }







  // NPC STUFF DOWN HERE

  public *npc01(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state });

    this.spaceToContinueText.visible = true; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Huh? I sense something…", },
      { speaker: "NPC", text: "Something weak… but new!", },
      { speaker: "NPC", text: "Time Warrior, is that you?", },
      { speaker: "NPC", text: "If you’re trying to talk to me, I’m sorry, but I can’t hear you.", },
      { speaker: "NPC", text: "As dryad ghosts, all we can really sense is sources of natural energy, and those are so scarce these days.", },
      { speaker: "NPC", text: "In fact, I’m only sensing a tiny bit of energy right now. Other ghosts might not even be able to sense you at all.", },
      { speaker: "NPC", text: "You might even just be a random flower. In which case, howdy!", },
      { speaker: "NPC", text: "…But if you are the Time Warrior, I’m rooting for you! Go and make Withers rot!", },
    ]);

    this.spaceToContinueText.visible = false; 

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); 

    state.mode = "Normal"; 
  }

  public *npc02(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state });

    this.spaceToContinueText.visible = true; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Has it been five hundred years since the Time Warrior was put to sleep yet?", },
      { speaker: "NPC", text: "It feels like he should be waking up any day now!", },
      { speaker: "NPC", text: "Surely we’d be able to sense him, right?", },
      { speaker: "NPC", text: "Hey, wait… I do sense something small…", },
      { speaker: "NPC", text: "Probably just some moss.", },
    ]);

    this.spaceToContinueText.visible = false; 

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); 

    state.mode = "Normal"; 
  }

  public *npc03(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state });

    this.spaceToContinueText.visible = true; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Time Warrior? Could it be?", },
      { speaker: "NPC", text: "Ever since our woods were cut down and Pastoria Metalworks opened, it’s been so hard to sense anything.", },
      { speaker: "NPC", text: "All the other dryad spirits and I have been wandering near-blind for so long…", },
      { speaker: "NPC", text: "But for the first time in ages, we have hope! Go get ‘em!", },
    ]);

    this.spaceToContinueText.visible = false; 

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); 

    state.mode = "Normal"; 
  }

  public *npc04(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state });

    this.spaceToContinueText.visible = true; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Boo-hoo… boo-hoo… sniff", },
      { speaker: "NPC", text: "There’s no use wishing. It won’t be long before the Tinker Men destroy all that remains of Pastoria Forest.", },
      { speaker: "NPC", text: "And when the forest disappears, so will we…", },
      { speaker: "NPC", text: "A-boo-hoo-hoo…", },      
    ]);

    this.spaceToContinueText.visible = false; 

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); 

    state.mode = "Normal"; 
  }

  public *npc05(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state });

    this.spaceToContinueText.visible = true; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "I sure do miss the Tree of Sprights.", },
      { speaker: "NPC", text: "Lounging around in the shade, swinging from its branches…", },
      { speaker: "NPC", text: "But those days are gone.", },
      { speaker: "NPC", text: "It’s so hard to sense now, and its signal keeps fading.", },
      { speaker: "NPC", text: "But as long as its Energy Fruit still sits at the top, I know it’ll be okay!", },        
    ]);

    this.spaceToContinueText.visible = false; 

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); 

    state.mode = "Normal"; 
  }

  public *npc06(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state });

    this.spaceToContinueText.visible = true; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Myah! I’m tired of waiting!", },
      { speaker: "NPC", text: "When is that pesky Time Warrior going to wake up?", },
      { speaker: "NPC", text: "He’s been sleeping for too long!", },
      { speaker: "NPC", text: "He’d better wake up soon and bring our forest back! Myah!", },            
    ]);

    this.spaceToContinueText.visible = false; 

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); 

    state.mode = "Normal"; 
  }

  public *npc07(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 0, state });

    this.spaceToContinueText.visible = true; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Time Warrior… if you can hear me…", },
      { speaker: "NPC", text: "You may be the last of our people, but I have faith that you can restore the forest.", },
      { speaker: "NPC", text: "The spirit of our race rests in your hands. I know you’ll keep it alive!", },
      { speaker: "Bud", text: "Hey, that’s the theme for the game jam!", },               
    ]);

    this.spaceToContinueText.visible = false; 

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state }); 

    state.mode = "Normal"; 
  }
}
