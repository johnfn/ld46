// aka this is where luny dumps everything

import { CoroutineManager, GameCoroutine } from "../library/coroutine_manager";
import { Game } from "./game";
import { DialogOverlay } from "./dialog_overlay";
import { TextEntity } from "../library/text_entity";
import { IGameState } from "Library";
import { DialogBox } from "./dialog_box";
import { DebugFlags } from "./debug";
import { Bud } from "./bud";
import { Vector2 } from "../library/geometry/vector2";

export type Tweenable = 
  | number
  | Vector2

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

  public static *LinearTween<T extends Tweenable>(props: {
    set   : (newValue: T) => void;
    start : T;
    stop  : T;
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
      if (typeof start === "number" && typeof stop === "number") {
        const value = start + (i * (stop - start)) / frames;

        set(value as any);
        yield "next";
      }

      if (start instanceof Vector2 && stop instanceof Vector2) {
        const newVector = new Vector2({
          x: start.x + (i * (stop.x - start.x)) / frames,
          y: start.y + (i * (stop.y - start.y)) / frames,
        });

        set(newVector as any);
        yield "next";
      }
    }

    set(stop);
  }

  public *fadeScreenToPercentage(props: { percentage: number; time: number; state: IGameState }): GameCoroutine {
    const { percentage, time, state } = props;

    yield* Cinematics.LinearTween({
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
    if (!DebugFlags["Show Bud Text"]) {
      return;
    }

    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Sigh... Another day, another lonely diary entry.", },
      { speaker: "Bud", text: "Dear diary...", },
      { speaker: "Bud", text: "I hope you’re doing well today!", },
      { speaker: "Bud", text: "Me? Oh, thanks for asking!", },
      { speaker: "Bud", text: "It’s been the same as every other day, I suppose.", },
      { speaker: "Bud", text: "Wake up, brush my wings, and stand guard for the whole day!", },
      { speaker: "Bud", text: "I can’t complain. I have stability and routine. What more could I want?", },
      { speaker: "Bud", text: "...I sure do hope he wakes up someday, though.", },
      { speaker: "Bud", text: "Huh? What’s that?", },
      { speaker: "Bud", text: "You want me to turn around?", },
      { speaker: "Bud", text: "What a silly book! Why would I want to do that?", },
    ]);

    state.mode = "Normal"; 

    const bud = Bud.Instance;

    let startX = bud.x;
    let startY = bud.y;

    for (let i = 0; i < 20; i++) {
      bud.x = startX + (Math.random() * 200 - 100);
      bud.y = startY + (Math.random() * 200 - 100);

      yield { frames: 2 };
    }

    yield* this.openingBud2();
  }

  public *openingBud2(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "HOLY CANOPIES! AM I DREAMING???", },
      { speaker: "Bud", text: "I WISH I COULD PINCH MYSELF!! I’VE BEEN WAITING FOR THIS MOMENT FOR SO LONG!", },
      { speaker: "Bud", text: "So... this is real? You’re really awake?", },
        // here there’s a yes or no choice. we can program that in later
      { speaker: "Bud", text: "Wait... you don’t look as excited as I am.", },
      { speaker: "Bud", text: "Could it be...? Nah, that’s impossible.", },
      { speaker: "Bud", text: "You remember me, right?", },
      { speaker: "Bud", text: "...", },
      { speaker: "Bud", text: "...You really don’t remember? No way.", },
      { speaker: "Bud", text: "We were friends for life! From the battlefield to the dinner table!", },
      { speaker: "Bud", text: "...Nothing, huh?", },
      { speaker: "Bud", text: "Wow. This really sucks.", },
      { speaker: "Bud", text: "Do you even remember who you are?", },
        // heres’s another yes or no choice except both choices yield the same thing
      { speaker: "Bud", text: "Whoa. That’s kinda trippy.", },
      { speaker: "Bud", text: "Well, let me be of assistance!", },
      { speaker: "Bud", text: "I’m Bud, your spirit partner! We’ve had a spirit link for... gosh, as long as I can remember.", },
      { speaker: "Bud", text: "People from all over knew us and loved us. But you were the main guy, of course.", },
      { speaker: "Bud", text: "Your name was one that the world remembered fondly...", },
        // player enters name! idk how to do that
      { speaker: "Bud", text: "$NAME, savior of the Pastoria Forest!", },
      { speaker: "Bud", text: "But... heh. I guess the Pastoria Forest is long, long gone.", },
      { speaker: "Bud", text: "It’s been gone for about five hundred years, in fact.", },
      { speaker: "Bud", text: "But that’s why you’re here! You’ll make things right again!", },
        // another choice where both options lead to the same thing
      { speaker: "Bud", text: "Well...", },
      { speaker: "Bud", text: "Actually, let’s take a look around. You can see it for yourself.", },
    ]);

    state.budFollowing = true;

    state.mode = "Normal"; 
  }

  public *outdoorBud1(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Yeah. Not too pretty.", }, 
      { speaker: "Bud", text: "So much metal, and so little nature. It’s really kind of horrifying.", },
      { speaker: "Bud", text: "But that’s why you were sent here, $NAME! You can help us make things better!", },
      // branching dialogue happens here
      // we'll wait for grant to figure that one out      
    ]);

    state.mode = "Normal"; 
  }

  public *outdoorBud2(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "What’s up? You look startled.", },
      // MORE branching dialogue
      { speaker: "Bud", text: "What? Don’t be weird, heh. That’s impossible.", },   
    ]);

    state.mode = "Normal"; 
  }

  public *hub01(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Welcome to the Tree of Sprights!", },
      { speaker: "Bud", text: "Huh... That's odd.", },
      { speaker: "Bud", text: "The entrance to Withers' Lair is above this area, but it looks like it’s been blocked off by some old vines or something.", },
      { speaker: "Bud", text: "That’s... actually a little disappointing.", },
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
      { speaker: "Bud", text: "Sadly, that’s not the exit that leads to Withers' Lair...", },
      { speaker: "Bud", text: "But let’s go explore it anyway! Maybe we’ll find something helpful.", },          
    ]);

    state.mode = "Normal"; 
  }

  public *hub03(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Huh. So you really can see ghosts? That’s so strange.", },
      { speaker: "Bud", text: "Hey, wait. This area looks kind of familiar.", },
      { speaker: "Bud", text: "Oh! I remember now! I actually know a shortcut to the Tree of Sprights from here!", },
      { speaker: "Bud", text: "C’mon, $NAME, there’s no time to waste!", },        
    ]);

    state.mode = "Normal"; 
  }

  public *vineworld01(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Uh oh, it looks like we’ve hit a dead end.", },
      { speaker: "Bud", text: "Unless we can somehow make a new pathway...?", },          
    ]);

    state.mode = "Normal"; 
  }

  public *vineworld02(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Wow, this vine thing is a game changer!", },
      { speaker: "Bud", text: "Wait, what the", },
      { speaker: "Bud", text: "How did you climb that? You don’t even have arms.", },               
    ]);

    state.mode = "Normal"; 
  }

  public *vineworld03(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Whoa... look at that.", },
      { speaker: "Bud", text: "I had no idea there was still a tree here!", },
      { speaker: "Bud", text: "It doesn’t look like it’s doing too hot, but I’m sure you’ll still get some good energy out of it.", },
      { speaker: "Bud", text: "Maybe even enough for us to unblock the Lair entrance!", },               
    ]);

    state.mode = "Normal"; 
  }

  public *hub04(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Let’s see if your new power has changed anything!", },             
    ]);

    state.mode = "Normal"; 
  }

  public *hub05(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Hey, cool!", },
      { speaker: "Bud", text: "Uh, that’s still not the shortcut.", },
      { speaker: "Bud", text: "But I’m sure there’s interesting stuff down there too!", },
      { speaker: "Bud", text: "Let’s go explore! Maybe we’ll find another cool tree. Or something.", },  
    ]);

    state.mode = "Normal"; 
  }

  public *mushworld01(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "...And, it looks like we’ve hit another dead end.", },
      { speaker: "Bud", text: "Aww, look at that cute little mushroom!", },      
    ]);

    state.mode = "Normal"; 
  }

  public *mushworld02(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Whoa! How did you do that?", },
      { speaker: "Bud", text: "Mushrooms aren’t even plants!", },
      { speaker: "Bud", text: "Artistic license, I guess.", },      
    ]);

    state.mode = "Normal"; 
  }

  public *mushworld03(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Gosh, look at that.", },
      { speaker: "Bud", text: "That’s the biggest mushroom I’ve ever seen.", },
      { speaker: "Bud", text: "Kinda crazy how much life is still hidden here.", },      
    ]);

    state.mode = "Normal"; 
  }

  public *hub06(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "Okay, there’s only one exit out of this tree base left.", },
      { speaker: "Bud", text: "Now the way to Withers’ Lair HAS to be next!", },            
    ]);

    state.mode = "Normal"; 
  }

  public *hub07(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Bud", text: "YES! It’s open!", },
      { speaker: "Bud", text: "C’mon, $NAME! Let’s go!", },           
    ]);

    state.mode = "Normal"; 
  }

  public *withers01(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
        // withers, alone, facing away from the entrance of his lair
      { speaker: "Withers", text: "♫ Doo de doo~ ♫", },
      { speaker: "Withers", text: "♫ Toss a coin to your Withers~ ♫", },
      { speaker: "Withers", text: "♫ Oh, factory of plenty~ ♫", },
      { speaker: "Withers", text: "Ahhh. What a wonderful time to be an industry leader. ", },
      { speaker: "Withers", text: "Business is booming, profits are soaring...", },
      { speaker: "Withers", text: "On days like these...", },
      { speaker: "Withers", text: "Heh.", },
      { speaker: "Withers", text: "On days like these, I do wonder about those old forest dolts.", },
      { speaker: "Withers", text: "If we hadn’t destroyed their whole race, where would they be now?", },
      { speaker: "Withers", text: "Perhaps they would’ve migrated off to some foreign land.", },
      { speaker: "Withers", text: "Perhaps they would’ve stayed hidden nearby, plotting their revenge.", },
      { speaker: "Withers", text: "But...", },
      { speaker: "Withers", text: "Heh.", },
      { speaker: "Withers", text: "Heheh.", },
      { speaker: "Withers", text: "That’s impossible.", },
      { speaker: "Withers", text: "After all, I saw to it myself.", },
      { speaker: "Withers", text: "Those hippies are gone for good.", },
        // herald and bud sneak in
      { speaker: "Withers", text: "Hmm.", },
      { speaker: "Withers", text: "Unless, of course...", },
      { speaker: "Withers", text: "There happened to be one left.", },
        // withers turns around to look at herald
      { speaker: "Withers", text: "Hello, $NAME.", },
      { speaker: "Withers", text: "I’ve been expecting you.", },
      { speaker: "Bud", text: "Master! Master! I’ve done as you asked!", },
      { speaker: "Withers", text: "Very good, Bud.", },
      { speaker: "Bud", text: "I’ve brought you the dirty dryad!", },
      { speaker: "Bud", text: "I even timed the entrance to be at the most dramatic part of your monologue! Just like we rehearsed!", },
      { speaker: "Withers", text: "Yes, thank you. I’m very proud of you, Bud.", },
      { speaker: "Withers", text: "...What, an evil tycoon can’t show his henchfairies some validation? Please.", },
      { speaker: "Withers", text: "Our society has progressed by five hundred years since you were put under that spell. Adapt to our new standards, or you’ll be streets behind.", },
      { speaker: "Withers", text: "Oh, I’m sorry. You don’t know what a “street” is. Or what “standards” are, for that matter.", },
      { speaker: "Bud", text: "Oooh! Clever burn, master! If I had arms, I would be dabbing in celebration!", },
      { speaker: "Bud", text: "Y’know, because we’re evil!", },
      { speaker: "Withers", text: "You must be so confused, $NAME. Let me make some things clear to you.", },
      { speaker: "Withers", text: "Firstly, you’re not here because you’re some kind of Superdryad who intrepidly braved the elements to get to my lair.", },
      { speaker: "Withers", text: "Didn’t you ever wonder why your journey here was so easy? I mean, I have Tinker Men everywhere that I could’ve sent to stop you.", },
      { speaker: "Withers", text: "No, you’re here because I wanted you to be here.", },
      { speaker: "Withers", text: "And definitely not because we didn’t have time to animate enemies or anything.", },
      { speaker: "Withers", text: "Secondly, this element of surprise that you thought you had?", },
      { speaker: "Withers", text: "Please. I’ve known about this plan since before you closed your eyes.", },
      { speaker: "Withers", text: "Dryad societies are soooo easy to infiltrate.", },
      { speaker: "Withers", text: "No security anywhere? Implicit trust of strangers? Like, okay, bloomer.", },
      { speaker: "Withers", text: "Perhaps you don’t understand what this knowledge has allowed me to do.", },
      { speaker: "Withers", text: "I’ve been planning for your return.", },
      { speaker: "Withers", text: "For the last five hundred years.", },
      { speaker: "Withers", text: "Everything you think you know about this world is just everything that Bud told you!", },
      { speaker: "Withers", text: "And you were foolish enough to believe every word!", },
      { speaker: "Withers", text: "What the hell is a “spirit partner” anyway? Blathering nonsense!", },
      { speaker: "Withers", text: "In fact, your name isn’t even $NAME!", },
      { speaker: "Withers", text: "That’s just a dumb name I told Bud to call you!", },
      { speaker: "Withers", text: "What even is that, anyway? $NAME?! What kind of simpleton would just go and embrace such a stupid name?!", },
      { speaker: "Bud", text: "WAHAHAH! You believed me!", },
      { speaker: "Withers", text: "You utter fool!", },
      { speaker: "Withers", text: "Anyway.", },
      { speaker: "Withers", text: "Lastly.", },
      { speaker: "Withers", text: "And most importantly.", },
      { speaker: "Withers", text: "The reason I’ve so cordially invited you here today.", },
      { speaker: "Withers", text: "Yes, you.", },
      { speaker: "Withers", text: "Herald of Wisp.", },
      { speaker: "Withers", text: "Your true name.", },
      { speaker: "Withers", text: "Herald, you are in this lair right now because I am going to kill you.", },
        // withers BRANDISHES A SWORD
      { speaker: "Withers", text: "You hear me? You’re not going to make it out of here alive.", },
      { speaker: "Withers", text: "And the last hope of the Pastorian Dryads will vanish.", },
      { speaker: "Withers", text: "No chance of defeating me.", },
      { speaker: "Withers", text: "No chance of reaching the Energy Fruit.", },
      { speaker: "Withers", text: "No chance of restoring the forest.", },
      { speaker: "Withers", text: "Any last words?", },
        // BIG IMPORTANT CHOICE HERE 
        // that grant has YET TO COMMENT ON
      { speaker: "Withers", text: "Hmph.", },
      { speaker: "Withers", text: "Thought so.", },
        // withers POUNCES SUPER FAST at herald
        // some metallic sfx?
      { text: "(You feel a burning in your chest.)", },
      { speaker: "Withers", text: "Hah...", },
      { speaker: "Withers", text: "Too easy.", },
      { text: "(The feeling starts burning stronger.)", },
      { text: "(It feels... healing.)", },
      { text: "(Your chest starts to glow.)", },
      { speaker: "Withers", text: "...wait.", },
      { speaker: "Withers", text: "You’re not dead.", },
      { speaker: "Withers", text: "What’s going on?", },
        // npc ghosts appear
      { speaker: "Bud", text: "Uh... Master...", },
      { speaker: "Bud", text: "In all the excitement... I may have forgotten to tell you about the ghosts...", },
      { speaker: "Withers", text: "WHAT?", },
      { speaker: "NPC", text: "So long as we, the spirits of the forest, still cling to existence...", },
      { speaker: "NPC", text: "You will not lay a hand on the Time Warrior!", },
      { speaker: "Withers", text: "What. The hell.", },
        // tries to stab a few more times
      { speaker: "NPC", text: "Herald is our hero and he is under our protection. STRIKE HIM NOT.", },
      { speaker: "Withers", text: "Grr...", },
      { speaker: "Withers", text: "You know what?", },
      { speaker: "Withers", text: "Fine.", },
      { speaker: "Withers", text: "I didn’t want to do this.", },
      { speaker: "Withers", text: "After all, I’ll lose the energy source for my power plants...", },
      { speaker: "Withers", text: "No. It’s a worthy sacrifice.", },
      { speaker: "Withers", text: "You cannot be allowed to come near the Energy Fruit.", },
      { speaker: "Withers", text: "I WILL DESTROY IT MYSELF.", },
        // withers flees away
        // herald chases after him
      { speaker: "Bud", text: "Oh dear. Oh dear, dear, dear.", },
        
    ]);

    state.mode = "Normal"; 
  }

  bossCount = 0;
  public *bossFail(): GameCoroutine { // the first NPC the player comes across
    this.bossCount = this.bossCount + 1;
    
    let state = yield "next";

    state.mode = "Dialog"; 

    if (this.bossCount === 1){

      yield* DialogBox.StartDialog([ 
        { speaker: "Withers", text: "AHAHAHA! Stupid idiot dryad!", },
        { speaker: "Withers", text: "Nice try, but the Energy Fruit is mine. Sorry, suckaaaa", },
          // npc ghosts appear
        { speaker: "NPC", text: "Time Warrior! There is yet one more trick up our sleeve.", },
        { speaker: "NPC", text: "It may destroy some of us... but there has never been a better time.", },
        { speaker: "NPC", text: "If we pool together our remaining energy, we can send you back in time, but only to the beginning of this tree chase.", },
        { speaker: "NPC", text: "We won’t be able to do this much, though. Get ready, and good luck!", },
          // back to start of boss chase        
      ]);

    } else {

      yield* DialogBox.StartDialog([ 
        { speaker: "Withers", text: "AHAHAHA! Stupid idiot dryad!", },
        { speaker: "Withers", text: "Nice try, but the Energy Fruit is mine. Sorry, suckaaaa", },
          // npc ghosts appear
        { speaker: "NPC", text: "Agh, you were so close!", },
        { speaker: "NPC", text: "It's okay, we still have enough juice to send you back in time once more.", },
        { speaker: "NPC", text: "But you gotta get it on this next one, okay?", },
          // back to start of boss chase
      ]);

    }

    state.mode = "Normal"; 
  }

  public *bossWin(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "Withers", text: "No! Don’t do it! Don’t touch that fruit!", },
      { speaker: "Withers", text: "Look. Maybe I came across too strongly.", },
      { speaker: "Withers", text: "I’m sure we can work a deal out.", },
      { speaker: "Withers", text: "Just stay away from the glowing cantaloupe!", },
      { speaker: "NPC", text: "God, just shut up already. Jeez.", },
        // [press x to interact] pops up
      { speaker: "Withers", text: "NOOOOOOOOOOO", },
        // fade to white                
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
        { speaker: "NPC", text: "Huh? I sense something...", },
        { speaker: "NPC", text: "Something weak... but new!", },
        { speaker: "NPC", text: "Time Warrior, is that you?", },
        { speaker: "NPC", text: "If you’re trying to talk to me, I’m sorry, but I can’t hear you.", },
        { speaker: "NPC", text: "As dryad ghosts, all we can really sense is sources of natural energy, and those are so scarce these days.", },
        { speaker: "NPC", text: "In fact, I’m only sensing a tiny bit of energy right now. Other ghosts might not even be able to sense you at all.", },
        { speaker: "NPC", text: "You might even just be a random flower. In which case, howdy!", },
        { speaker: "NPC", text: "...But if you are the Time Warrior, I’m rooting for you! Go and make Withers rot!", },
      ]);

    } else {

      yield* DialogBox.StartDialog([ 
        { speaker: "NPC", text: "Time Warrior, is that you?", },
        { speaker: "NPC", text: "As dryad ghosts, all we can really sense is sources of natural energy, and those are so scarce these days.", },
        { speaker: "NPC", text: "In fact, I’m only sensing a tiny bit of energy right now. Other ghosts might not even be able to sense you at all.", },
        { speaker: "NPC", text: "...But if you are the Time Warrior, I’m rooting for you! Go and make Withers rot!", },
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
      { speaker: "NPC", text: "Hey, wait... I do sense something small...", },
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
      { speaker: "NPC", text: "All the other dryad spirits and I have been wandering near-blind for so long...", },
      { speaker: "NPC", text: "But for the first time in ages, we have hope! Go get ‘em!", },
    ]);

    state.mode = "Normal"; 
  }

  public *npc04(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Boo-hoo... boo-hoo... *sniff*", },
      { speaker: "NPC", text: "There’s no use wishing. It won’t be long before the Tinker Men destroy all that remains of Pastoria Forest.", },
      { speaker: "NPC", text: "And when the forest disappears, so will we...", },
      { speaker: "NPC", text: "A-boo-hoo-hoo...", },      
    ]);

    state.mode = "Normal"; 
  }

  public *npc05(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "I sure do miss the Tree of Sprights.", },
      { speaker: "NPC", text: "Lounging around in the shade, swinging from its branches...", },
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
      { speaker: "NPC", text: "Time Warrior... if you can hear me...", },
      { speaker: "NPC", text: "You may be the last of our people, but I have faith that you can restore the forest.", },
      { speaker: "NPC", text: "The spirit of our race rests in your hands. I know you’ll keep it alive!", },
      { speaker: "Bud", text: "Hey, that’s the theme for the game jam!", },               
    ]);

    state.mode = "Normal"; 
  }

  npc08CheckCount = 0;
  public *npc08(): GameCoroutine { // first NPC in vine world
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
        { speaker: "NPC", text: "I sure wish I could go sit down somewhere...", },            
      ]);

    } else {

      yield* DialogBox.StartDialog([ 
        { speaker: "NPC", text: "I have to keep wandering around! If I don’t, then the Time Warrior won’t have me to draw Spirit Energy from!", },
        { speaker: "NPC", text: "In fact, he can check out how much Spirit Energy he has left in his Spirit Meter.", },
        { speaker: "NPC", text: "And I know all my ghost buddies are nearby for him to replenish his energy from too!", },
        { speaker: "NPC", text: "I sure wish I could go sit down somewhere...", },        
      ]);

    }

    state.mode = "Normal"; 
  }

  npc09CheckCount = 0;
  public *npc09(): GameCoroutine { // vine world
    this.npc09CheckCount = this.npc09CheckCount + 1;
    
    let state = yield "next";

    state.mode = "Dialog"; 

    if (this.npc09CheckCount === 1){

      yield* DialogBox.StartDialog([ 
        { speaker: "NPC", text: "Vines are so cool. They’re like, my second-favorite favorite plant.", },
        { speaker: "NPC", text: "You can grow them...", },
        { speaker: "NPC", text: "Climb up them...", },
        { speaker: "NPC", text: "Climb down them...", },
        { speaker: "NPC", text: "Climb back up them...", },
        { speaker: "NPC", text: "Uh...", },
        { speaker: "NPC", text: "Where was I?", },
        { speaker: "NPC", text: "Whoa, is that a vine?", },
        { speaker: "NPC", text: "Did I mention that vines are like, my second favorite plant?", },
        { speaker: "NPC", text: "You can grow them...", },
        { speaker: "NPC", text: "Climb up them...", },
        { speaker: "NPC", text: "Climb... yawn...", },
        { speaker: "NPC", text: "zzz...", },          
      ]);

    } else {

      yield* DialogBox.StartDialog([ 
        { speaker: "NPC", text: "zzz...", },  
      ]);

    }

    state.mode = "Normal"; 
  }

  public *npc10(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Yap!", },
      { speaker: "NPC", text: "Yap! Yap!", },
      { text: "(It’s a puppy ghost in the body of a dryad ghost!)", },
    ]);

    state.mode = "Normal"; 
  }

  public *npc11(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "I wonder if any of the other ghosts think it’s weird that we’re all just talking to ourselves constantly.", },
      { speaker: "NPC", text: "There really isn’t much of anything else to do, though.", },
      { speaker: "NPC", text: "We just gotta go crazy and shout into the void! It’s our only shot to survive!", },
    ]);

    state.mode = "Normal"; 
  }

  public *npc12(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "I wonder if the vines are still around?", },
      { speaker: "NPC", text: "I still remember the day I found two vines growing out of the same root!", },
      { speaker: "NPC", text: "It was a BINE!", },
      { speaker: "NPC", text: "...Yeah, comedy was never my strong suit, even when I was alive.", },      
    ]);

    state.mode = "Normal"; 
  }

  public *npc13(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "I wonder if the Time Warrior is up.", },
      { speaker: "NPC", text: "I also wonder how many Spirit Slots the Time Warrior has!", },
      { speaker: "NPC", text: "Does he have five yet? That’s the maximum, right?", },
      { speaker: "NPC", text: "There couldn’t be any ways to unlock Secret Slots lying around, right?", },
      { speaker: "NPC", text: "So much to wonder about...", },            
    ]);

    state.mode = "Normal"; 
  }

  npc14CheckCount = 0;
  public *npc14(): GameCoroutine { // first npc encountered in MushWorld(tm)
    this.npc14CheckCount = this.npc14CheckCount + 1;
    
    let state = yield "next";

    state.mode = "Dialog"; 

    if (this.npc14CheckCount === 1){

      yield* DialogBox.StartDialog([ 
        { speaker: "NPC", text: "Whoa... Did a nearby natural presence just grow stronger?", },
        { speaker: "NPC", text: "I haven’t felt something like that in centuries!", },
        { speaker: "NPC", text: "It must be the Time Warrior!", },
        { speaker: "NPC", text: "Hey, Time Warrior! Can you see me? It’s me, Squill!", },
        { speaker: "NPC", text: "At least, I hope you’re the Time Warrior. But what else could you be? Everything else is slowly dying...", },
        { speaker: "NPC", text: "This is so cool, though! You’re finally back, and we’re one step closer to restoring the forest!", },
        { speaker: "NPC", text: "I wish I could do something in the physical world to help you, but us ghosts are far too weak for anything like that at the moment.", },
        { speaker: "NPC", text: "Just remember, I’ll always be there cheering you on! When there’s a Squill, there’s a squay!", },             
      ]);

    } else {

      yield* DialogBox.StartDialog([ 
        { speaker: "NPC", text: "I wish I could do something in the physical world to help you, but us ghosts are far too weak for anything like that at the moment.", },
        { speaker: "NPC", text: "Just remember, I’ll always be there cheering you on! When there’s a Squill, there’s a squay!", },        
      ]);

    }

    state.mode = "Normal"; 
  }

  public *npc15(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "I wish my parents were still around.", },
      { speaker: "NPC", text: "I prayed so hard that they would become ghosts like I did, but...", },
      { speaker: "NPC", text: "I guess they just didn’t have as much unfinished business as me.", },
      { speaker: "NPC", text: "Kind of ironic, really.", },
      { speaker: "NPC", text: "C’mon, Time Warrior. Make things right. I believe in you.", },            
    ]);

    state.mode = "Normal"; 
  }

  public *npc16(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "There’s been some buzzing going on that the Time Warrior might be back!", },
      { speaker: "NPC", text: "Could it be true? That would be crazy!", },
      { speaker: "NPC", text: "But wait... Withers still doesn’t know about him, right?", },
      { speaker: "NPC", text: "I hope not. Otherwise, our five-hundred year comeback plan will have been a huge dud...", },                
    ]);

    state.mode = "Normal"; 
  }

  public *npc17(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "Hello? Anyone?", },
      { speaker: "NPC", text: "I think I lost my puppy!", },
      { speaker: "NPC", text: "If anyone could help me find him, I’d be very grateful!", },
      { speaker: "NPC", text: "Man, I hope this doesn’t activate a sidequest or something. We DEFINITELY don’t have time to program one of those.", },                  
    ]);

    state.mode = "Normal"; 
  }
  
  public *npc18(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    yield* DialogBox.StartDialog([ 
      { speaker: "NPC", text: "If what they say is true and the Time Warrior is truly awake...", },
      { speaker: "NPC", text: "Maybe we should all head to the top of the Tree of Sprights!", },
      { speaker: "NPC", text: "The Energy Fruit at the top of the tree is the best chance that he has at restoring the forest.", },
      { speaker: "NPC", text: "And if he use it to channel enough natural energy, maybe we could even get our bodies back!", },
      { speaker: "NPC", text: "Gosh, wouldn’t that be a miracle?", },                       
    ]);

    state.mode = "Normal"; 
  }


  // INTERACTION STUFF

  hubFlowerLevel = 0;
  flowerCheckLv0 = 0;
  flowerCheckLv1 = 0;
  flowerCheckLv2 = 0;
  flowerCheckFinal = 0;
  public *hubFlower(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog"; 

    if (this.hubFlowerLevel === 0){
      if (this.flowerCheckLv0 === 0){
        this.flowerCheckLv0 = this.flowerCheckLv0 + 1;

        yield* DialogBox.StartDialog([ 
          { text: "You gently touch a small, delicate sunblossom.", },
          { text: "Floral energy starts to flow through you.", },         
        ]);

      } else {
        this.flowerCheckLv0 = this.flowerCheckLv0 + 1;

        yield* DialogBox.StartDialog([ 
          { text: "Floral energy is flowing through you.", },       
        ]);

      }
    } else if (this.hubFlowerLevel === 1){
      if (this.flowerCheckLv1 === 0){
        this.flowerCheckLv1 = this.flowerCheckLv1 + 1;

        yield* DialogBox.StartDialog([ 
          { text: "You caress the petals of a growing sunblossom. It begins to light up.", },
          { text: "Fluorescent energy starts to flow through you.", },         
        ]);

      } else {
        this.flowerCheckLv1 = this.flowerCheckLv1 + 1;

        yield* DialogBox.StartDialog([ 
          { text: "Fluorescent energy is flowing through you.", },       
        ]);

      } 
    } else if (this.hubFlowerLevel === 2){
        if (this.flowerCheckLv2 === 0){
          this.flowerCheckLv2 = this.flowerCheckLv2 + 1;
  
          yield* DialogBox.StartDialog([ 
            { text: "You firmly grasp the stem of a sturdy sunblossom.", },
            { text: "Sylvan energy starts to flow through you.", },         
          ]);
  
        } else {
          this.flowerCheckLv1 = this.flowerCheckLv1 + 1;
  
          yield* DialogBox.StartDialog([ 
            { text: "Sylvan energy is flowing through you.", },       
          ]);
      } 
    } else if (this.hubFlowerLevel === 3){
        this.flowerCheckFinal = this.flowerCheckFinal + 1;

        yield* DialogBox.StartDialog([ 
          { text: "You marvel at the tenacity of a sunblossom.", },     
        ]);

      } else {

        yield* DialogBox.StartDialog([ 
          { text: "Now how did you get to here?", },     
        ]);

      }
    }

  wisteriaCheckCount = 0;
  public *wisteria(): GameCoroutine { 
    this.wisteriaCheckCount = this.wisteriaCheckCount + 1;
    
    let state = yield "next";

    state.mode = "Dialog"; 

    if (this.wisteriaCheckCount === 1){
      this.hubFlowerLevel = this.hubFlowerLevel + 1;

      yield* DialogBox.StartDialog([ 
        { text: "You reach out to the wisteria. It seems to grow stronger in your presence.", },
        { text: "Verdant energy starts to flow through you.", },
        // spirit slots increase! 
        { text: "Your number of Spirit Slots increased!", },
      ]);
    
    } else {

      yield* DialogBox.StartDialog([ 
        { text: "The wisteria stands majestically before you. Its trunk is straighter than it was when you first saw it.", },  
      ]);

    }

    state.mode = "Normal"; 
  }

}
