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

  public *openingBud1(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

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

    state.mode = "Normal"; 
  }

  public *openingBud2(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "HOLY CANOPIES! AM I DREAMING???", },
      { speaker: "Bud", text: "I WISH I COULD PINCH MYSELF!! I’VE BEEN WAITING FOR THIS MOMENT FOR SO LONG!", },
      { speaker: "Bud", text: "So… this is real? You’re really awake?", },
      // here there’s a yes or no choice. we can program that in later
      { speaker: "Bud", text: "Wait… you don’t look as excited as I am.", },
      { speaker: "Bud", text: "Could it be…? Nah, that’s impossible.", },
      { speaker: "Bud", text: "You remember me, right?", },
      { speaker: "Bud", text: "…", },
      { speaker: "Bud", text: "… You really don’t remember? No way.", },
      { speaker: "Bud", text: "We were friends for life! From the battlefield to the dinner table!", },
      { speaker: "Bud", text: "… Nothing, huh?", },
      { speaker: "Bud", text: "Wow. This really sucks.", },
      { speaker: "Bud", text: "Do you even remember who you are?", },
      // heres’s another yes or no choice except both choices yield the same thing
      { speaker: "Bud", text: "Whoa. That’s kinda trippy.", },
      { speaker: "Bud", text: "Well, let me be of assistance!", },
      { speaker: "Bud", text: "I’m Bud, your spirit partner! We’ve had a spirit link for… gosh, as long as I can remember.", },
      { speaker: "Bud", text: "People from all over knew us and loved us. But you were the main guy, of course.", },
      { speaker: "Bud", text: "Your name was one that the world remembered fondly…", },
      // player enters name! idk how to do placeholder text 
      { speaker: "Bud", text: "PLACEHOLDER, savior of the Pastoria Forest!", },
      { speaker: "Bud", text: "But… heh. I guess the Pastoria Forest is long, long gone.", },
      { speaker: "Bud", text: "It’s been gone for about five hundred years, in fact.", },
      { speaker: "Bud", text: "But that’s why you’re here! You’ll make things right again!", },
      // another choice where both options lead to the same thing
      { speaker: "Bud", text: "Well…", },
      { speaker: "Bud", text: "Actually, let’s take a look around. You can see it for yourself.", },
    ]);

    state.mode = "Normal"; 
  }

  public *hub01(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Oh, what?", },
      { speaker: "Bud", text: "I guess I haven’t been here in a while.", },
      { speaker: "Bud", text: "The shortcut is at the top of this area, but it looks like it’s been blocked off by some old vines or something.", },
      { speaker: "Bud", text: "That’s… actually a little disappointing.", },
      { speaker: "Bud", text: "I’m sorry I couldn’t help more.", },      
    ]);

    state.mode = "Normal"; 
  }

  public *hub02(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "How did you do that?!", },
      { speaker: "Bud", text: "It must be your nature powers! Maybe they’re coming back!", },
      { speaker: "Bud", text: "Sadly, that’s not the exit that leads to the shortcut…", },
      { speaker: "Bud", text: "But let’s go explore it anyway! Maybe we’ll find something helpful.", },          
    ]);

    state.mode = "Normal"; 
  }




  // NPC STUFF DOWN HERE

  npc01CheckCount = 0;
  public *npc01(): GameCoroutine { // the first NPC the player comes across
    this.npc01CheckCount = this.npc01CheckCount + 1;
    
    let state = yield "next";

    state.mode = "Dialog"; 

    if (this.npc01CheckCount === 1){

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

    } else {

      yield* DialogBox.StartDialog([ 
        { speaker: "NPC", text: "Time Warrior, is that you?", },
        { speaker: "NPC", text: "As dryad ghosts, all we can really sense is sources of natural energy, and those are so scarce these days.", },
        { speaker: "NPC", text: "In fact, I’m only sensing a tiny bit of energy right now. Other ghosts might not even be able to sense you at all.", },
        { speaker: "NPC", text: "…But if you are the Time Warrior, I’m rooting for you! Go and make Withers rot!", },
      ]);

    }

    state.mode = "Normal"; 
  }

  public *npc02(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Has it been five hundred years since the Time Warrior was put to sleep yet?", },
      { speaker: "NPC", text: "It feels like he should be waking up any day now!", },
      { speaker: "NPC", text: "Surely we’d be able to sense him, right?", },
      { speaker: "NPC", text: "Hey, wait… I do sense something small…", },
      { speaker: "NPC", text: "Probably just some moss.", },
    ]);

    state.mode = "Normal"; 
  }

  public *npc03(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Time Warrior? Could it be?", },
      { speaker: "NPC", text: "Ever since our woods were cut down and Pastoria Metalworks opened, it’s been so hard to sense anything.", },
      { speaker: "NPC", text: "All the other dryad spirits and I have been wandering near-blind for so long…", },
      { speaker: "NPC", text: "But for the first time in ages, we have hope! Go get ‘em!", },
    ]);

    state.mode = "Normal"; 
  }

  public *npc04(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Boo-hoo… boo-hoo… *sniff*", },
      { speaker: "NPC", text: "There’s no use wishing. It won’t be long before the Tinker Men destroy all that remains of Pastoria Forest.", },
      { speaker: "NPC", text: "And when the forest disappears, so will we…", },
      { speaker: "NPC", text: "A-boo-hoo-hoo…", },      
    ]);

    state.mode = "Normal"; 
  }

  public *npc05(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "I sure do miss the Tree of Sprights.", },
      { speaker: "NPC", text: "Lounging around in the shade, swinging from its branches…", },
      { speaker: "NPC", text: "But those days are gone.", },
      { speaker: "NPC", text: "It’s so hard to sense now, and its signal keeps fading.", },
      { speaker: "NPC", text: "But as long as its Energy Fruit still sits at the top, I know it’ll be okay!", },        
    ]);

    state.mode = "Normal"; 
  }

  public *npc06(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Myah! I’m tired of waiting!", },
      { speaker: "NPC", text: "When is that pesky Time Warrior going to wake up?", },
      { speaker: "NPC", text: "He’s been sleeping for too long!", },
      { speaker: "NPC", text: "He’d better wake up soon and bring our forest back! Myah!", },            
    ]);

    state.mode = "Normal"; 
  }

  public *npc07(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Time Warrior… if you can hear me…", },
      { speaker: "NPC", text: "You may be the last of our people, but I have faith that you can restore the forest.", },
      { speaker: "NPC", text: "The spirit of our race rests in your hands. I know you’ll keep it alive!", },
      { speaker: "Bud", text: "Hey, that’s the theme for the game jam!", },               
    ]);

    state.mode = "Normal"; 
  }

  npc08CheckCount = 0;
  public *npc08(): GameCoroutine { // the first NPC the player comes across
    this.npc08CheckCount = this.npc08CheckCount + 1;
    
    let state = yield "next";

    state.mode = "Dialog"; 

    if (this.npc08CheckCount === 1){

      yield* DialogBox.StartDialog([ 
        { speaker: "NPC", text: "I wish I could go sit down somewhere.", },
        { speaker: "NPC", text: "But I have to keep wandering around! If I don’t, then the Time Warrior won’t have me to draw Spirit Energy from!", },
        { speaker: "NPC", text: "In fact, he can check out how much Spirit Energy he has left in his Spirit Meter.", },
        { speaker: "NPC", text: "And I know all my ghost buddies are nearby for him to replenish his energy from too!", },
        { speaker: "NPC", text: "Wait, why am I talking to myself about this? I know all of this already, hah.", },
        { speaker: "NPC", text: "Maybe I’m going crazy!", },
        { speaker: "NPC", text: "I sure wish I could go sit down somewhere…", },            
      ]);

    } else {

      yield* DialogBox.StartDialog([ 
        { speaker: "NPC", text: "I have to keep wandering around! If I don’t, then the Time Warrior won’t have me to draw Spirit Energy from!", },
        { speaker: "NPC", text: "In fact, he can check out how much Spirit Energy he has left in his Spirit Meter.", },
        { speaker: "NPC", text: "And I know all my ghost buddies are nearby for him to replenish his energy from too!", },
        { speaker: "NPC", text: "I sure wish I could go sit down somewhere…", },        
      ]);

    }

    state.mode = "Normal"; 
  }





  // INTERACTION STUFF

  public *hubFlower(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { text: "You pick up a small, delicate sunblossom.", },
      { text: "Floral energy starts to flow through you.", },         
    ]);

    state.mode = "Normal"; 
  }

}
