import { Assets } from "./assets";
import { IGameState } from "Library";
import { Entity } from "../library/entity";
import { Fountain } from "./fountain";
import { Util } from "../library/util";

export const SetAudioToLoop = (audio: HTMLAudioElement) => {
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play();
  });

  return audio;
}

export class Sfx extends Entity {
  public tickSound   = Assets.getResource("sound effects/button 1");
  public tickSound2  = Assets.getResource("sound effects/button 2");
  public voiceSound1 = Assets.getResource("sound effects/voices/voice 1");
  public voiceSound2 = Assets.getResource("sound effects/voices/voice 2");
  public voiceSound3 = Assets.getResource("sound effects/voices/voice 3");
  public voiceSound4 = Assets.getResource("sound effects/voices/voice 4");
  public voiceWithers= Assets.getResource("sound effects/voices/voice withers");
  public climaxSweep = Assets.getResource("sound effects/climax sweep");
  public alertNoise  = Assets.getResource("sound effects/alert_noise");

  public useSpirit   = Assets.getResource("sound effects/use spirit");
  public waterfall   = Assets.getResource("sound effects/waterfall");

  constructor() {
    super({ name: "Sfx" });

    SetAudioToLoop(this.waterfall);
    this.waterfall.play();
  }

  public playVoiceSound1(tick: number) {
    if (tick % 5 === 0) {
      this.voiceSound1.currentTime = 0;
      this.voiceSound1.play();
    }
  }

  public playVoiceSound2(tick: number) {
    if (tick % 5 === 0) {
      this.voiceSound2.currentTime = 0;
      this.voiceSound2.play();
    }
  }

  public playVoiceSound3(tick: number) {
    if (tick % 5 === 0) {
      this.voiceSound3.currentTime = 0;
      this.voiceSound3.play();
    }
  }

  public playVoiceSound4(tick: number) {
    if (tick % 5 === 0) {
      this.voiceSound4.currentTime = 0;
      this.voiceSound4.play();
    }
  }

  public playVoiceWithers(tick: number) {
    if (tick % 5 === 0) {
      this.voiceWithers.currentTime = 0;
      this.voiceWithers.play();
    }
  }

  public update(state: IGameState) {
    const fountains = state.entities.values().filter(x => x instanceof Fountain) as Fountain[];
    const closestFountain = Util.MinBy(fountains, f => f.distance(state.player))?.distance(state.player)!;

    let fountainVol = Math.max(1 - closestFountain / 4000, 0);

    this.waterfall.volume = fountainVol;
  }
}