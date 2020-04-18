import { KeyInfoType } from "./keyboard";
import { IGameState } from "Library";
import { Entity } from "./entity";
import { Game } from "../game/game";

/**
 * const state: GameState = yield CoroutineResult;
 */
export type GameCoroutine = Generator<CoroutineResult, void, IGameState>

export type CoroutineResult = "next" | { frames: number } | { untilKeyPress: keyof KeyInfoType };

type ActiveCoroutine = {
  fn     : GameCoroutine;
  status : 
    | { waiting: false }
    | { waiting: true; type: "frames"  ; frames: number }
    | { waiting: true; type: "untilKey"; untilKey: keyof KeyInfoType }
  name    : string;
  owner   : Entity | Game;
};

export type CoroutineId = number;

export class CoroutineManager {
  private lastCoroutineId: CoroutineId = -1;
  private activeCoroutines: { [key: number]: ActiveCoroutine } = [];

  startCoroutine(name: string, co: GameCoroutine, owner: Entity | Game): CoroutineId {
    for (const activeCo of Object.values(this.activeCoroutines)) {
      if (activeCo.name === name) {
        throw new Error(`Two coroutines with the name ${ name }. Tell grant about this!!!`);
      }
    }

    this.activeCoroutines[++this.lastCoroutineId] = {
      fn     : co,
      status : { waiting: false },
      name   : name,
      owner  : owner,
    };

    return this.lastCoroutineId;
  }

  public stopCoroutine(id: CoroutineId): void {
    delete this.activeCoroutines[id];
  }

  public updateCoroutines(state: IGameState): void {
    for (const key of Object.keys(this.activeCoroutines)) {
      const co = this.activeCoroutines[Number(key)];

      if (co.status.waiting) {
        if (co.status.type === "frames") {
          if (co.status.frames-- < 0) {
            co.status = { waiting: false };
          } else {
            continue;
          }
        } else if (co.status.type === "untilKey") {
          if (state.keys.justDown[co.status.untilKey]) {
            co.status = { waiting: false };
          } else {
            continue;
          }
        }
      }

      const { value, done } = co.fn.next(state);

      if (done) {
        this.stopCoroutine(Number(key));

        continue;
      }

      if (value === "next") {
        continue;
      } 

      if (typeof value === "object") {
        if ("frames" in value) {
          co.status = { waiting: true, type: 'frames', frames: value.frames };

          continue;
        } else if ("untilKeyPress" in value) {
          co.status = { waiting: true, type: 'untilKey', untilKey: value.untilKeyPress };

          continue;
        }
      }
    }
  }

  stopCoroutinesOwnedBy(entity: Entity) {
    const ids = Object.keys(this.activeCoroutines).map(k => Number(k));

    for (const id of ids) {
      if (this.activeCoroutines[id].owner === entity) {
        this.stopCoroutine(id);
      }
    }
  }
}
