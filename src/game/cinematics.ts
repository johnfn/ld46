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
import { NpcDialog } from "./npc";
import { Entity } from "../library/entity";
import { HubLocation } from "./hub_location";
import { Withers } from "./withers";

export type Tweenable =
  | number
  | Vector2

export class Cinematics {
  coroutineManager   : CoroutineManager;
  game               : Game;
  spaceToContinueText: TextEntity;

  name = "Herald";

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

    // SPEECH 

    yield* DialogBox.StartDialog([
      { speaker: "???", text: "Sigh... Another day, another lonely diary entry.", },
      { speaker: "???", text: "Dear diary...", },
      { speaker: "???", text: "I hope you’re doing well today!", },
      { speaker: "???", text: "Me? Oh, thanks for asking!", },
      { speaker: "???", text: "It’s been the same as every other day, I suppose.", },
      { speaker: "???", text: "Wake up, brush my wings, and stand guard for the whole day!", },
      { speaker: "???", text: "I can’t complain. I have stability and routine. What more could I want?", },
      { speaker: "???", text: "...I sure do hope he wakes up someday, though.", },
      { speaker: "???", text: "Huh? What’s that?", },
      { speaker: "???", text: "You want me to turn around?", },
      { speaker: "???", text: "Silly book! Why would I want to do that?", },
    ]);

    state.mode = "Normal";

    /*
    for (let i = 0; i < 20; i++) {
      bud.x = startX + (Math.random() * 200 - 100);
      bud.y = startY + (Math.random() * 200 - 100);

      yield { frames: 2 };
    }
    */

    // yield* this.openingBud2(); // comment this out later
  }

  public *openingBud2(): GameCoroutine {
    let state = yield "next";
  
    state.mode = "Dialog";

    const bud = Bud.Instance;

      let startX = bud.x;
      let startY = bud.y;
  
    yield* DialogBox.StartDialog([
      { speaker: "???", text: "Huh? What was that sound?", },
    ]);
      
    bud.sprite.scale.x = bud.sprite.scale.x * -1;
  
    yield { frames: 40 };
        
    //new Entity({ texture: Assets.getResource(exclamation) })
    state.sfx.alertNoise.play();

    yield { frames: 50 };
        
    for (let i = 0; i < 8; i++) {
      bud.sprite.rotation = bud.sprite.rotation - (Math.PI / 4);
      yield { frames: 2 };
    }

    yield* DialogBox.StartDialog([
      { speaker: "???", text: "HOLY CANOPIES!", },
      { speaker: "???", text: "AM I DREAMING??? I WISH I COULD PINCH MYSELF!", },
      { speaker: "???", text: "I’VE BEEN WAITING FOR THIS MOMENT FOR SO LONG!", },
      { speaker: "???", text: "HIHIHIHIHIHIHI", },
    ]);
      
    for (let i = 0; i < 10; i++) {
      bud.x = bud.x - 100;
      yield { frames: 1 };
    }

    yield* DialogBox.StartDialog([
      {
        speaker: "???",
        text: `So... this is real? You’re really awake, ${ this.name }?`,
        branches: [
          { text: "Yes", next: [
            { speaker: "???", text: "YESS!!! Oh my gosh, there’s so much to show you!", },
          ] },
          { text: "No", next: [
            { speaker: "???", text: "Huh... so that means..."},
            { speaker: "???", text: "That I'M the one dreaming..."},
            { speaker: "???", text: "And if that's the case..."},
            { speaker: "???", text: "THEN I NEVER WANNA WAKE UP!!! And I'll PRETEND this is real!!!"},
          ] },
        ]
      },
      { speaker: "???", text: "C'mon! Let's go to the forest!", },
      { speaker: "???", text: "Or... what used to be the forest...", },
      { speaker: "???", text: "...but that doesn’t matter! You’re awake now! You'll make things better!", },
      { speaker: "???", text: "C’MON!!!! It's just over to the right!", },
    ]);
  
    state.budFollowing = true;
  
    state.mode = "Normal";
  }

  public *openingBud3(): GameCoroutine {
    let state = yield "next";
  
    state.mode = "Dialog";
  
    yield* DialogBox.StartDialog([
      { speaker: "???", text: "Yeah... it really doesn't look too good out here.", },
      { speaker: "???", text: "Those Tinker Men really did a number on the forest. It's almost all gone...", },
      { speaker: "???", text: "But now you're here! The secret weapon of the dryads!", },
      {
        speaker: "???",
        text: "You've got a plan to bring the forest back, right?",
        branches: [
          { text: "Yes?", next: [
            { speaker: "???", text: "HELL YEAH!! I'm all ears!! Mostly because I'm missing a couple of other appendages.", },
            { speaker: "???", text: `What's the plan, ${ this.name }? I'm listening...`},
            { speaker: "???", text: "..."},
            { speaker: "???", text: "..."},
            { speaker: "???", text: "You're... not saying anything."},
          ] },
          { text: "No?", next: [
            { speaker: "???", text: "...huh? What do you mean?", },
            { speaker: "???", text: "I thought that was the whole point of putting you to sleep for so long...", },
            { speaker: "???", text: "You're staring at me pretty blankly, dude.", },
          ] },
        ]
      },
      {
        speaker: "???",
        text: "Everything okay?",
        branches: [
          { text: "No.", next: [
            { speaker: "???", text: "Oh no... I can see it in your eyes. You don't know anything that's going on, do you?", },
          ] },
          { text: "No?", next: [
            { speaker: "???", text: "I should've known... I can see it in your eyes. You don't understand anything that's going on, do you?", },
          ] },
        ]
      },
      { speaker: "???", text: "This is awful... You don't even recognize me?", },
      { speaker: "???", text: "I was your spirit partner, long ago. It's me, Bud!", },
      { speaker: "Bud", text: "Nothing????? C'mon, jog that memory!", },
      { speaker: "Bud", text: `You're ${ this.name }! Hero of the Pastoria Forest!`, },
      { speaker: "Bud", text: "...Well, I guess the forest has been long, long gone. And so have you. For about five hundred years.", },
      { speaker: "Bud", text: `There's a reason you're here, ${ this.name }. You were sent here to the future to take down Withers, the leader of the Tinker Men who destroyed our home.`, },
      { speaker: "Bud", text: "And if you don't remember anything... then it's up to me, Bud, to help you!", },
      { speaker: "Bud", text: `C'mon, ${ this.name }! Withers' Lair is in the Tree of Sprights, which is the only remaining big tree left. Let's go find him!!`, },
    ]);
  
    state.budFollowing = true;
  
    state.mode = "Normal";
  }
 

  public *outdoorBud1(): GameCoroutine { // functionally replaced by openingBud3
    let state = yield "next";

    state.mode = "Dialog";

    yield* DialogBox.StartDialog([
      { speaker: "Bud", text: "Yeah. Not too pretty.", },
      { speaker: "Bud", text: "So much metal, and so little nature. It’s really kind of horrifying.", },
      { speaker: "Bud", text: `But that’s why you were sent here, ${ this.name }! You can help us make things better!`, },
    ]);

    state.mode = "Normal";
  }

  public *outdoorOneHalf(): GameCoroutine { // functionally replaced by openingBud3
    let state = yield "next";

    state.mode = "Dialog";

    yield* DialogBox.StartDialog([
      { speaker: " ", text: "Passing by the fountain, you feel a change in the atmosphere.", },
      { speaker: " ", text: "It radiates a spirit-replenshing energy.", },
      { speaker: " ", text: "As you set foot in the soil beyond, your feet begin to tingle...", },
    ]);

    state.mode = "Normal";
  }

  public *outdoorBud2(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* DialogBox.StartDialog([
      {
        speaker: "Bud",
        text: "What’s up? You look startled.",
        branches: [
          { text: "There's another person there...", next: [
            { speaker: "Bud", text: "What? Don’t be weird, heh. That’s impossible.", },
          ] },
          { text: "I think I see dead people?", next: [
            { speaker: "Bud", text: "What? Don’t be paranoid, heh. That’s impossible.", },
          ] },
          { text: "AAAAAAAA GHOST", next: [
            { speaker: "Bud", text: "What? Don’t be scared, heh. That’s impossible.", },
          ] },
        ]
      },
    ]);

    state.mode = "Normal";
  }

  public *outdoorBud3(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* DialogBox.StartDialog([
      { speaker: "Bud", text: "Huh. So you really can see ghosts? That’s so strange.", },
      { speaker: "Bud", text: "I can't see anything, but I trust you!", },
      { speaker: "Bud", text: "Hey, wait. This area looks kind of familiar!", },
      { speaker: "Bud", text: "Oh! I remember now! I actually know a shortcut to the Tree of Sprights from here!", },
      { speaker: "Bud", text: `It's right this way, ${ this.name }! There’s no time to waste!`, },
      { speaker: "Bud", text: "(I'm trying to point, but I don't think it's working.", },
    ]);

    state.mode = "Normal";
  }

  public *hub01(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* DialogBox.StartDialog([
      { speaker: "Bud", text: "Welcome to the bottom of the Tree of Sprights!", },
      { speaker: "Bud", text: "Huh... That's odd.", },
      { speaker: "Bud", text: "The entrance to Withers' Lair is above here, but getting up there will be tough.", },
      { speaker: "Bud", text: "You just woke up, and it doesn't look like you're strong enough yet...", },
      { speaker: "Bud", text: "I wonder if there's anything else we could explore, though?", },
      { speaker: "Bud", text: "Hey, what's that area all the way to the right?", },
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
      { speaker: "Bud", text: `C’mon, ${ this.name }, there’s no time to waste!`, },
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
      { speaker: "Bud", text: "Whoa, that's so cool! This vine thing is a game changer!", },
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
      { speaker: "Bud", text: "Uh, this still isn't the way to Withers' Lair.", },
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
      { speaker: "Bud", text: "It's a little sad-looking, but that’s still the biggest mushroom I’ve seen in centuries.", },
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
      { speaker: "Bud", text: "YES! We can get to Withers' Lair now!", },
      { speaker: "Bud", text: `C’mon, ${ this.name }! Let’s go!`, },
    ]);

    state.mode = "Normal";
  }

  public *lair01(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* DialogBox.StartDialog([
      { speaker: "Bud", text: "So this is Withers' Lair...", },
      { speaker: "Bud", text: "Kinda spooky!", },
    ]);

    
    Withers.Instance.x = state.player.x - 10;
    Withers.Instance.y = state.player.y - 10;
    

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
      { speaker: "Withers", text: "Hmm.", },
      { speaker: "Withers", text: "Unless, of course...", },
      { speaker: "Withers", text: "There happened to be one left.", },
    ]);

        // withers turns around to look at herald
    
    yield* DialogBox.StartDialog([
      { speaker: "Withers", text: `Hello, ${ this.name }.`, },
      { speaker: "Withers", text: "I’ve been expecting you.", },
      { speaker: "Bud", text: "Master! Master! I’ve done as you asked!", },
      { speaker: "Withers", text: "Very good, Bud.", },
      { speaker: "Bud", text: "I’ve brought you the dirty dryad!", },
      { speaker: "Bud", text: "I even timed our entrance to the start of your dramatic monologue! Just like we rehearsed!", },
      { speaker: "Withers", text: "Yes, thank you. I’m very proud of you, Bud.", },
      { speaker: "Withers", text: "...What, an evil tycoon can’t show his henchfairies some validation? Please.", },
      { speaker: "Withers", text: "Our society has progressed by five hundred years since you were put under that spell. Adapt to our new standards, or you’ll be streets behind.", },
      { speaker: "Withers", text: "Oh, I’m sorry. You don’t know what a “street” is. Or what “standards” are, for that matter.", },
      { speaker: "Bud", text: "Oooh! Clever burn, master! If I had arms, I would be dabbing in celebration!", },
      { speaker: "Bud", text: "Y’know, because we’re evil!", },
      { speaker: "Withers", text: `You must be so confused, ${ this.name }. Let me make some things clear to you.`, },
      { speaker: "Withers", text: "Firstly, you’re not here because you’re some kind of Superdryad who intrepidly braved the elements to get to my lair.", },
      { speaker: "Withers", text: "Didn’t you wonder why your journey here was so easy? I mean, I have Tinker Men everywhere that I could’ve sent to stop you.", },
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
      { speaker: "Withers", text: `In fact, your name isn’t even ${ this.name }!`, },
      { speaker: "Withers", text: "That’s just a dumb name I told Bud to call you!", },
      { speaker: "Withers", text: `What even is that, anyway? ${ this.name }?! What kind of simpleton would just go and embrace such a stupid name?!`, },
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
      { speaker: "Withers", text: "You hear me? You’re not going to make it out of here alive.", },
      { speaker: "Withers", text: "And the last hope of the Pastorian Dryads will vanish.", },
      { speaker: "Withers", text: "No chance of defeating me.", },
      { speaker: "Withers", text: "No chance of reaching the Energy Fruit.", },
      { speaker: "Withers", text: "No chance of restoring the forest.", },
      {
        speaker: "Withers",
        text: "Any last words?",
        branches: [
          { text: "...", next: [
            { speaker: "Withers", text: "Thought so.", },
          ] },
          { text: "...", next: [
            { speaker: "Withers", text: "Thought so.", },
          ] },
          { text: "You scoundrel! You won't get away with this!", next: [
            { speaker: "SPONSORED CONTENT", text: "Sorry! To be able to choose this option, please pay $19.99 to purchase the extra Premium Content at the website www.murderwithers.com!", },
            { speaker: "Withers", text: "Not saying anything, hmm?", },
            { speaker: "Withers", text: "Thought so.", },
          ] },
        ]
      },
      { speaker: "Withers", text: "DARK BLAST HAH", },
    ]);

        // ball of darkness shoots at herald
    
    yield* DialogBox.StartDialog([
      { speaker: " ", text: "(You feel a burning in your chest.)", },
      { speaker: "Withers", text: "Hah...", },
      { speaker: "Withers", text: "Too easy.", },
      { speaker: " ", text: "(The feeling starts burning stronger.)", },
      { speaker: " ", text: "(It feels... healing.)", },
      { speaker: " ", text: "(Your chest starts to glow.)", },
      { speaker: "Withers", text: "...wait.", },
      { speaker: "Withers", text: "You’re not dead.", },
      { speaker: "Withers", text: "What’s going on?", },
    ]);

        // npc ghosts appear

    yield* DialogBox.StartDialog([
      { speaker: "Bud", text: "Uh... Master...", },
      { speaker: "Bud", text: "In all the excitement... I may have forgotten to tell you about the ghosts...", },
      { speaker: "Withers", text: "The", },
      { speaker: "Withers", text: "WHAT", },
      { speaker: "Wisps", text: "Never fear, Time Warrior! You are under our protection, for you have given us strength and hope!", },
      { speaker: "Squill", text: "Hey, Time Warrior! It's me, Squill! Remember me?", },
      { speaker: "Wisps", text: "Listen here, Withers.", },
      { speaker: "Wisps", text: "So long as we, the spirits of the forest, still cling to existence...", },
      { speaker: "Wisps", text: "You will not lay a hand on the Time Warrior!", },
      { speaker: "Pisp", text: "Yap! Yap!", },
      { speaker: "Withers", text: "What. The hell.", },
    ]);

        // tries to shoot dark blast a few more times

    yield* DialogBox.StartDialog([
      { speaker: "Wisps", text: "ATTACK HIM NOT.", },
      { speaker: "Withers", text: "Grr...", },
      { speaker: "Withers", text: "You know what?", },
      { speaker: "Withers", text: "Fine.", },
      { speaker: "Withers", text: "I didn’t want to do this.", },
      { speaker: "Withers", text: "After all, I’ll lose the energy source for my power plants...", },
      { speaker: "Withers", text: "No. It’s a worthy sacrifice.", },
      { speaker: "Withers", text: "You cannot be allowed to come near the Energy Fruit.", },
      { speaker: "Withers", text: "I WILL GO DESTROY IT MYSELF.", },
    ]);

        // withers flees 

    yield* DialogBox.StartDialog([
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
        { speaker: "Wisps", text: "Time Warrior! There is yet one more trick up our sleeve.", },
        { speaker: "Wisps", text: "It may destroy some of us... but there has never been a better time.", },
        { speaker: "Wisps", text: "If we pool together our remaining energy, we can send you back in time, but only to the beginning of this tree chase.", },
        { speaker: "Wisps", text: "We won’t be able to do this much, though. Get ready, and good luck!", },
          // back to start of boss chase
      ]);

    } else {

      yield* DialogBox.StartDialog([
        { speaker: "Withers", text: "AHAHAHA! Stupid idiot dryad!", },
        { speaker: "Withers", text: "Nice try, but the Energy Fruit is mine. Sorry, suckaaaa", },
          // npc ghosts appear
        { speaker: "Wisps", text: "Agh, you were so close!", },
        { speaker: "Wisps", text: "It's okay, we still have enough juice to send you back in time once more.", },
        { speaker: "Wisps", text: "But you gotta get it on this next one, okay?", },
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
      { speaker: "Wisps", text: "God, just shut up already. Jeez.", },
    ]);

    state.mode = "Normal";
  }

  public *touchFruit(): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* DialogBox.StartDialog([
      { speaker: "Withers", text: "NOOOOOOOOOOOO", },
    ]);

    state.sfx.climaxSweep.play();

    // simultaneous climax_sweep.mp3 and fade to white

    state.mode = "Normal";
  }




  // NPC STUFF DOWN HERE

  npc01CheckCount = 0;
  public *npc01(speaker: Entity): GameCoroutine { // the first NPC the player comes across
    this.npc01CheckCount = this.npc01CheckCount + 1;

    let state = yield "next";

    state.mode = "Dialog";

    if (this.npc01CheckCount === 1) {
      yield* NpcDialog.StartDialog([
        { speaker, text: "Huh? I sense something...", },
        { speaker, text: "Something weak... but something new!", },
        { speaker, text: "Could it possibly be... the Time Warior? After so long?", },
        { speaker, text: "Time Warrior, if you’re trying to talk to me, I’m sorry, but I can’t hear you.", },
        { speaker, text: "As dryad wisps, all we can really sense is sources of natural energy, and those are so scarce these days.", },
        { speaker, text: "Honestly, I’m only sensing a tiny bit of energy right now. Other ghosts might not even be able to sense you at all.", },
        { speaker, text: "In fact, you might even just be a random flower. In which case, howdy!", },
        { speaker, text: "...But if you actually are the Time Warrior, I’m rooting for you! Go and make Withers rot!", },
      ]);
    } else {
      yield* NpcDialog.StartDialog([
        { speaker, text: "Time Warrior, is that you?", },
        { speaker, text: "As dryad wisps, all we can really sense is sources of natural energy, and those are so scarce these days.", },
        { speaker, text: "In fact, I’m only sensing a tiny bit of energy right now. Other ghosts might not even be able to sense you at all.", },
        { speaker, text: "...But if you actually are the Time Warrior, I’m rooting for you! Go and make Withers rot!", },
      ]);
    }

    state.mode = "Normal";
  }

  public *npc02(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Has it been five hundred years since the Time Warrior was put to sleep yet?", },
      { speaker, text: "It feels like he should be waking up any day now!", },
      { speaker, text: "Surely we’d be able to sense him, right?", },
      { speaker, text: "Hey, wait... I do sense something minor...", },
      { speaker, text: "Probably just some moss.", },
    ]);

    state.mode = "Normal";
  }

  public *npc03(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Time Warrior? Could it be?", },
      { speaker, text: "Ever since our woods were cut down and Pastoria Metalworks opened, it’s been so hard to sense anything natural.", },
      { speaker, text: "All the other dryad wisps and I have been wandering near-blind for so long...", },
      { speaker, text: "If you can hear me, Time Warrior, I hope you come back to us soon.", },
    ]);

    state.mode = "Normal";
  }

  public *npc04(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Boo-hoo... boo-hoo... *sniff*", },
      { speaker, text: "There’s no use wishing. It won’t be long before the Tinker Men destroy all that remains of Pastoria Forest.", },
      { speaker, text: "And when the forest disappears, so will we...", },
      { speaker, text: "A-boo-hoo-hoo...", },
    ]);

    state.mode = "Normal";
  }

  public *npc05(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "I sure do miss the Tree of Sprights.", },
      { speaker, text: "Lounging around in the shade, swinging from its branches...", },
      { speaker, text: "But those days are gone.", },
      { speaker, text: "It’s so hard to sense now, and its signal keeps fading.", },
      { speaker, text: "But as long as its Energy Fruit still sits at the top, I know it’ll be okay!", },
    ]);

    state.mode = "Normal";
  }

  public *npc06(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Myah! I’m tired of waiting!", },
      { speaker, text: "When is that pesky Time Warrior going to wake up?", },
      { speaker, text: "He’s been sleeping for too long!", },
      { speaker, text: "He’d better wake up soon and bring our forest back! Myah!", },
    ]);

    state.mode = "Normal";
  }

  public *npc07(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Time Warrior... if you can hear me...", },
      { speaker, text: "You may be the last of our people, but I have faith that you can restore the forest.", },
      { speaker, text: "The spirit of our race rests in your hands. I know you’ll keep it alive!", },
      { speaker: Bud.Instance, text: "Hey, that’s the theme for the game jam!", },
    ]);

    state.mode = "Normal";
  }

  npc08CheckCount = 0;
  public *npc08(speaker: Entity): GameCoroutine { // first NPC in vine world
    this.npc08CheckCount = this.npc08CheckCount + 1;

    let state = yield "next";

    state.mode = "Dialog";

    if (this.npc08CheckCount === 1){

      yield* NpcDialog.StartDialog([
        { speaker, text: "I wish I could go sit down somewhere.", },
        { speaker, text: "But I have to stay here and keep talking! If the Time Warrior comes back, I have important information for him!", },
        { speaker, text: "What if he doesn't remember that he can use his Spirit Power to breathe life back into certain plants?", },
        { speaker, text: "Or that if his Spirit Slots empty out, he can recharge them by standing near the aura of a Weeping Wisp fountain!", },
        { speaker, text: "Wait, why am I talking to myself about this? I know all of this already, hah.", },
        { speaker, text: "Maybe I’m going crazy!", },
        { speaker, text: "I sure wish I could go sit down somewhere...", },
      ]);

    } else {

      yield* NpcDialog.StartDialog([
        { speaker, text: "If the Time Warrior comes back, I have important information for him!", },
        { speaker, text: "What if he doesn't remember that he can use his Spirit Power to breathe life back into certain plants?", },
        { speaker, text: "Or that if his Spirit Slots empty out, he can recharge them by standing near the aura of a Weeping Wisp fountain!", },
        { speaker, text: "I sure wish I could go sit down somewhere...", },
      ]);

    }

    state.mode = "Normal";
  }

  npc09CheckCount = 0;
  public *npc09(speaker: Entity): GameCoroutine { // vine world
    this.npc09CheckCount = this.npc09CheckCount + 1;

    let state = yield "next";

    state.mode = "Dialog";

    if (this.npc09CheckCount === 1){

      yield* NpcDialog.StartDialog([
        { speaker, text: "Vines are so cool. They’re like, my second-favorite favorite plant.", },
        { speaker, text: "You can grow them...", },
        { speaker, text: "Climb up them...", },
        { speaker, text: "Climb down them...", },
        { speaker, text: "Climb back up them...", },
        { speaker, text: "Uh...", },
        { speaker, text: "Where was I?", },
        { speaker, text: "Whoa, is that a vine?", },
        { speaker, text: "Did I mention that vines are like, my second favorite plant?", },
        { speaker, text: "You can grow them...", },
        { speaker, text: "Climb up them...", },
        { speaker, text: "Climb... yawn...", },
        { speaker, text: "zzz...", },
      ]);

    } else {

      yield* NpcDialog.StartDialog([
        { speaker, text: "zzz...", },
      ]);

    }

    state.mode = "Normal";
  }

  public *npc10(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Yap!", },
      { speaker, text: "Yap! Yap!", },
      { speaker, text: "(It’s a puppy wisp! A pisp!)", },
    ]);

    state.mode = "Normal";
  }

  public *npc11(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "I wonder if any of the other ghosts think it’s weird that we’re all just talking to ourselves constantly.", },
      { speaker, text: "There really isn’t much of anything else to do, though.", },
      { speaker, text: "We just gotta go crazy and shout into the void! It’s our only shot to survive!", },
    ]);

    state.mode = "Normal";
  }

  public *npc12(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "I wonder if the vines are still around?", },
      { speaker, text: "I still remember the day I found two vines growing out of the same root!", },
      { speaker, text: "It was a BINE!", },
      { speaker, text: "...Yeah, comedy was never my strong suit, even when I was alive.", },
    ]);

    state.mode = "Normal";
  }

  public *npc13(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "I wonder if the Time Warrior is up.", },
      { speaker, text: "I also wonder how many Spirit Slots the Time Warrior has!", },
      { speaker, text: "Does he have five yet? That’s the maximum, right?", },
      { speaker, text: "There couldn’t be any ways to unlock Secret Slots lying around, right?", },
      { speaker, text: "So much to wonder about...", },
    ]);

    state.mode = "Normal";
  }

  public *npc13Extra(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "We wisps do talk a lot, but that's because we're so faded away!", },
      { speaker, text: "If we don't talk randomly, how would we remember our history?", },
      { speaker, text: "Like our tradition of rooting for people by rooting into the ground!", },
      { speaker, text: "Or the escapades our intrepid President, Grower Leafland!", },
      { speaker, text: "I'm so excited for the Time Warrior to wake up. So I can have another person to talk to.", },
    ]);

    state.mode = "Normal";
  }

  npc14CheckCount = 0;
  public *npc14(speaker: Entity): GameCoroutine { // first npc encountered in MushWorld(tm)
    this.npc14CheckCount = this.npc14CheckCount + 1;

    let state = yield "next";

    state.mode = "Dialog";

    if (this.npc14CheckCount === 1){

      yield* NpcDialog.StartDialog([
        { speaker, text: "Whoa... Did a nearby natural presence just grow stronger?", },
        { speaker, text: "I haven’t felt something like that in centuries!", },
        { speaker, text: "It must be the Time Warrior!", },
        { speaker, text: "Hey, Time Warrior! Can you see me? It’s me, Squill!", },
        { speaker, text: "At least, I hope you’re the Time Warrior. But what else could you be? Everything else is slowly dying...", },
        { speaker, text: "This is so cool, though! You’re finally back, and we’re one step closer to restoring the forest!", },
        { speaker, text: "I wish I could do something in the physical world to help you, but us wisps are far too weak for anything like that at the moment.", },
        { speaker, text: "Just remember, I’ll always be there cheering you on! When there’s a Squill, there’s a squay!", },
      ]);

    } else {

      yield* NpcDialog.StartDialog([
        { speaker, text: "I wish I could do something in the physical world to help you, but us wisps are far too weak for anything like that at the moment.", },
        { speaker, text: "Just remember, I’ll always be there cheering you on! When there’s a Squill, there’s a squay!", },
      ]);

    }

    state.mode = "Normal";
  }

  public *npc15(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "I wish my parents were still around.", },
      { speaker, text: "I prayed so hard that they would become ghosts like I did, but...", },
      { speaker, text: "I guess they just didn’t have as much unfinished business as me.", },
      { speaker, text: "Kind of ironic, really.", },
      { speaker, text: "C’mon, Time Warrior. Make things right. I believe in you.", },
    ]);

    state.mode = "Normal";
  }

  public *npc16(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "There’s been some buzzing going on that the Time Warrior might be back!", },
      { speaker, text: "Could it be true? That would be crazy!", },
      { speaker, text: "But wait... Withers still doesn’t know about him, right?", },
      { speaker, text: "I hope not. Otherwise, our five-hundred year comeback plan will have been a huge dud...", },
    ]);

    state.mode = "Normal";
  }

  public *npc17(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Hello? Anyone?", },
      { speaker, text: "I think I lost my puppy!", },
      { speaker, text: "If anyone could help me find him, I’d be very grateful!", },
      { speaker, text: "Man, I hope this doesn’t activate a sidequest or something. We DEFINITELY don’t have time to program one of those.", },
    ]);

    state.mode = "Normal";
  }

  public *npc18(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "If what they say is true and the Time Warrior is truly awake...", },
      { speaker, text: "Maybe we should all head to the top of the Tree of Sprights!", },
      { speaker, text: "The Energy Fruit at the top of the tree is the best chance that the Time Warrior has at restoring the forest.", },
      { speaker, text: "And if he uses it to channel enough natural energy, maybe we could even get our bodies back!", },
      { speaker, text: "Gosh, wouldn’t that be a miracle?", },
    ]);

    state.mode = "Normal";
  }

  public *npc19(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "If there's one thing that I miss most about being able to see and hear the world...", },
      { speaker, text: "It's that I don't know if I'll ever get to hear the tree's song again.", },
      { speaker, text: "How does it go? I can't remember...", },
      { speaker, text: "Something about seeing flowers, perhaps?", },
      { speaker, text: "Maybe I'll remember the words tomorrow.", },
    ]);

    state.mode = "Normal";
  }

  public *npc20(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "When I was younger, I thought I would grow up to become someone incredible.", },
      { speaker, text: "Maybe I’d be a nature shaman, or discover a new type of tree!", },
      { speaker, text: "Or even be the dialogue writer for a video game!", },
      { speaker, text: "But none of that ever happened. Instead, I’m stuck here as a wisp, forever.", },
      { speaker, text: "Always wondering... What could’ve been?", },
    ]);

    state.mode = "Normal";
  }

  public *npc21(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Oh my gosh! Time Warrior, is that you?", },
      { speaker, text: "I'm such a huge fan!", },
      { speaker, text: "Hey, watch out for Withers, okay? He's a sneaky snapdragon.", },
      { speaker, text: "But with element of surprise, how could you lose? You're the best!", },
      { speaker, text: "Hey, after you restore the forest, I was wondering...", },
      { speaker, text: "Could I get your autograph, maybe?", },
    ]);

    state.mode = "Normal";
  }

  public *npc22(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Time Warrior. Your aura grows ever stronger.", },
      { speaker, text: "Withers' Lair draws near. Be cautious.", },
      { speaker, text: "I believe in you.", },
    ]);

    state.mode = "Normal";
  }

  public *npcWithers(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "How did you activate this text? Truly incredible.", },
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

  public *teleportBackToHub(): GameCoroutine {
    let state = yield "next";

    yield* this.fadeScreenToPercentage({ percentage: 100, time: 90, state });

    state.player.x = HubLocation.Instance.x;
    state.player.y = HubLocation.Instance.y;

    yield* DialogOverlay.StartDialog([
      { speaker: "Herald", text: "...A mysterious force returns you to the Hub...", },
    ]);

    state.mode = "Normal"; // let player fall

    state.camera.centerOn(state.player, true);
    state.camera.update(state);

    yield* this.fadeScreenToPercentage({ percentage: 0, time: 90, state });
  }

  wisteriaCheckCount = 0;
  public *wisteria(): GameCoroutine {
    this.wisteriaCheckCount = this.wisteriaCheckCount + 1;

    let state = yield "next";

    state.mode = "Dialog";

    if (this.wisteriaCheckCount === 1){
      this.wisteriaCheckCount = this.wisteriaCheckCount + 1;

      yield* DialogBox.StartDialog([
        { text: "You reach out to the wisteria. It seems to grow stronger in your presence.", },
        { text: "Verdant energy starts to flow through you.", },
        { text: "Your number of Spirit Slots increased!", },
      ]);

      yield* this.teleportBackToHub();
    } else {
      yield* DialogBox.StartDialog([
        { text: "The wisteria stands majestically before you. It blooms with vigor.", },
      ]);
    }

    state.mode = "Normal";
  }

  bigMushCheckCount = 0;
  public *bigMush(): GameCoroutine {
    this.bigMushCheckCount = this.bigMushCheckCount + 1;

    let state = yield "next";

    state.mode = "Dialog";

    if (this.bigMushCheckCount === 1){
      this.bigMushCheckCount = this.bigMushCheckCount + 1;

      yield* DialogBox.StartDialog([
        { text: "The giant mushroom is cool to the touch.", },
        { text: "Buoyant energy starts to flow through you.", },
        { text: "Your number of Spirit Slots increased!", },
      ]);

      this.teleportBackToHub();
    } else {

      yield* DialogBox.StartDialog([
        { text: "The mushroom has grown plumper. It seems pleased with itself.", },
      ]);

    }

    state.mode = "Normal";
  }

  public *fountain00(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "It's a fountain with a statue of a crying woman.", },
      { speaker, text: "The water in its basin seems dusty, like it hasn't been cleaned in a long time.", },
    ]);

    state.mode = "Normal";
  }

  public *fountain01(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of uncertainty.", },
      { speaker, text: "What's going on...?", },
    ]);

    state.mode = "Normal";
  }

  public *fountainHub(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "You hear the echoes of voices past from within the fountain.", },
      { speaker, text: "'Keep going! You're doing great!'", },
    ]);

    state.mode = "Normal";
  }

  public *fountainVine1(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of calm.", },
      { speaker, text: "The way forward is becoming clearer.", },
    ]);

    state.mode = "Normal";
  }

  public *fountainVine2(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of clarity.", },
      { speaker, text: "It's as if the brambles in your head have started to declutter.", },
    ]);

    state.mode = "Normal";
  }

  public *fountainVine3(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of history.", },
      { speaker, text: "These relics of a vibrant society used to mean so much to so many. It would be good to make things right.", },
    ]);

    state.mode = "Normal";
  }

  public *fountainVine4(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of progress.", },
      { speaker, text: "You're almost there.", },
    ]);

    state.mode = "Normal";
  }

  public *fountainMush1(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of tenacity.", },
      { speaker, text: "Nothing can stop you.", },
    ]);

    state.mode = "Normal";
  }

  public *fountainMush2(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of illumination.", },
      { speaker, text: "You're starting to see the light.", },
    ]);

    state.mode = "Normal";
  }

  public *fountainMush3(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of determination.", },
      { speaker, text: "Hey, wait a minute. We can't use that word anymore.", },
    ]);

    state.mode = "Normal";
  }

  public *fountainMush4(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of progress.", },
      { speaker, text: "Just one more room.", },
    ]);

    state.mode = "Normal";
  }

  public *fountainLair(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of boreboding.", },
      { speaker, text: "Withers looms.", },
    ]);

    state.mode = "Normal";
  }

  public *fountainPrep(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Standing near the fountain, you feel a sense of preparation.", },
      { speaker, text: "You're getting ready to do something great.", },
    ]);

    state.mode = "Normal";
  }

  public *fountainBoss(speaker: Entity): GameCoroutine {
    let state = yield "next";

    state.mode = "Dialog";

    yield* NpcDialog.StartDialog([
      { speaker, text: "Time is of the essence.", },
    ]);

    state.mode = "Normal";
  }

}
