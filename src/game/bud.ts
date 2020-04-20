import { Entity } from "../library/entity";
import { Assets } from "./assets";
import { IGameState } from "Library";
import { GameCoroutine } from "../library/coroutine_manager";
import { Vector2 } from "../library/geometry/vector2";
import { Cinematics } from "./cinematics";

export class Bud extends Entity {
  public static Instance: Bud;
  following = false;

  constructor() {
    super({
      name: "Bud",
    });

    this.texture = Assets.getResource("bud");

    Bud.Instance = this;
  }

  *budFollow(): GameCoroutine {
    let state = yield "next";

    while (true) {
      state = yield "next";

      let nextPosition = state.player.position.add(Vector2.Random(200, 200, -200, -200));

      yield* Cinematics.LinearTween({
        set   : v => this.position = v,
        start : this.position,
        stop  : nextPosition,
        frames: 120,
      });
    }
  }

  update(state: IGameState) {
    if (state.budFollowing && !this.following) {
      this.following = true;

      this.startCoroutine("budfollow", this.budFollow());
    }
  }
}