import { Assets } from "./assets";

export class Sfx {
  public static VoiceSound1 = Assets.getResource("sound effects/voices/voice 1");
  public static VoiceSound2 = Assets.getResource("sound effects/voices/voice 2");
  public static VoiceSound3 = Assets.getResource("sound effects/voices/voice 3");
  public static VoiceSound4 = Assets.getResource("sound effects/voices/voice 4");
  public static VoiceWithers= Assets.getResource("sound effects/voices/voice withers");

  public static UseSpirit   = Assets.getResource("sound effects/use spirit");

  public static PlayVoiceSound1(tick: number) {
    if (tick % 5 === 0) {
      Sfx.VoiceSound1.currentTime = 0;
      Sfx.VoiceSound1.play();
    }
  }

  public static PlayVoiceSound2(tick: number) {
    if (tick % 5 === 0) {
      Sfx.VoiceSound2.currentTime = 0;
      Sfx.VoiceSound2.play();
    }
  }

  public static PlayVoiceSound3(tick: number) {
    if (tick % 5 === 0) {
      Sfx.VoiceSound3.currentTime = 0;
      Sfx.VoiceSound3.play();
    }
  }

  public static PlayVoiceSound4(tick: number) {
    if (tick % 5 === 0) {
      Sfx.VoiceSound4.currentTime = 0;
      Sfx.VoiceSound4.play();
    }
  }

  public static PlayVoiceithers(tick: number) {
    if (tick % 5 === 0) {
      Sfx.VoiceWithers.currentTime = 0;
      Sfx.VoiceWithers.play();
    }
  }
}