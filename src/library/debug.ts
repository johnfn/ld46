import { Vector2 } from "./geometry/vector2";
import { Graphics, Sprite, Container } from "pixi.js";
import { Line } from "./geometry/line";
import { Entity } from "./entity";
import { Rect } from "./geometry/rect";
import { RectGroup } from "./geometry/rect_group";
import { GameReference } from "./base_game";
import { BaseGameState } from "./base_state";

const MAX_DEBUGGING_GRAPHICS_COUNT = 500;

export class Debug {
  public static stageReference: Entity;

  public static DebugMode = false;

  public static DebugGraphicStack: Graphics[] = [];

  public static Clear(): void {
    for (const debug of Debug.DebugGraphicStack) {
      debug.parent.removeChild(debug);
      debug.destroy();
    }

    Debug.DebugGraphicStack = [];
  }

  /** 
   * Draw a point on the canvas.
   * 
   * We expect this function to be called every tick in an update() function.
   * Debug graphics drawn in the previous tick are removed in the game loop. 
   * If that's not what you want, pass persistent = true.
   */
  public static DrawPoint(point: Vector2, color = 0xff0000, persistent = false): Graphics {
    const graphics = new Graphics();

    new Line({
      x1: point.x - 10,
      x2: point.x + 10,

      y1: point.y - 10,
      y2: point.y + 10,
    }).drawOnto(graphics, color);

    new Line({
      x1: point.x + 10,
      x2: point.x - 10,

      y1: point.y - 10,
      y2: point.y + 10,
    }).drawOnto(graphics, color);

    GameReference.stage.sprite.addChild(graphics);

    if (!persistent) {
      this.DebugGraphicStack.push(graphics);

      if (this.DebugGraphicStack.length > MAX_DEBUGGING_GRAPHICS_COUNT) {
        const toBeRemoved = this.DebugGraphicStack.shift()!;

        toBeRemoved.parent.removeChild(toBeRemoved);
        toBeRemoved.destroy();
      }
    }

    return graphics;
  }

  /** 
   * Draw a line from start to end on the canvas, for debugging.
   * 
   * We expect this function to be called every tick in an update() function.
   * Debug graphics drawn in the previous tick are removed in the game loop.
   * 
   * If that's not what you want, pass persistent = true.
   */
  public static DrawLineV2(start: Vector2, end: Vector2, color = 0xff0000, persistent = false): Graphics {
    return Debug.DrawLine(new Line({ start, end }), color);
  }

  /** 
   * Draw a line on the canvas, for debugging.
   * 
   * We expect this function to be called every tick in an update() function.
   * Debug graphics drawn in the previous tick are removed in the game loop.
   * 
   * If that's not what you want, pass persistent = true.
   */
  public static DrawLine(line: Line, color = 0xff0000, persistent = false): Graphics {
    const graphics = new Graphics();

    line.drawOnto(graphics, color);

    GameReference.fixedCameraStage.sprite.addChild(graphics);

    if (persistent) {
      this.DebugGraphicStack.push(graphics);

      if (this.DebugGraphicStack.length > MAX_DEBUGGING_GRAPHICS_COUNT) {
        const toBeRemoved = this.DebugGraphicStack.shift()!;

        toBeRemoved.parent.removeChild(toBeRemoved);
        toBeRemoved.destroy();
      }
    }

    return graphics;
  }

  /** 
   * Draw a rectangle from start to end on the canvas, for debugging.
   * 
   * We expect this function to be called every tick in an update() function.
   * Debug graphics drawn in the previous tick are removed in the game loop.
   * 
   * If that's not what you want, pass persistent = true.
   */
  public static DrawRect(rect: Rect, color = 0xff0000, persistent = false): Graphics[] {
    const lines: Graphics[] = [];

    for (const line of rect.getLinesFromRect()) {
      lines.push(Debug.DrawLine(line, color));
    }

    return lines;
  }

  /** 
   * Draw the bounds of a game object on the canvas, for debugging.
   * 
   * We expect this function to be called every tick in an update() function.
   * Debug graphics drawn in the previous tick are removed in the game loop.
   * 
   * If that's not what you want, pass persistent = true.
   */
  public static DrawBounds(entity: Entity | Sprite | Graphics | RectGroup | Container, color = 0xff0000, persistent = false): Graphics[] {
    if (entity instanceof Entity) {
      const group = entity.boundsAbsolute();

      return Debug.DrawRect(group, color);
    } else if (entity instanceof RectGroup) {
      const results: Graphics[] = [];

      for (const rect of entity.getRects()) {
        const lines = Debug.DrawRect(rect, color);

        for (const line of lines) {
          results.push(line);
        }
      }

      return results;
    } else {
      return Debug.DrawRect(new Rect({
        x     : entity.x,
        y     : entity.y,
        width : entity.width,
        height: entity.height,
      }), color);
    }
  }

  private static profiles: { [key: string]: number[] } = {};

  /**
   * Performance test a block of code.
   */
  public static Profile(name: string, cb: () => void): void {
    Debug.profiles[name] = Debug.profiles[name] || [];

    const start = window.performance.now();

    cb(); 

    const end = window.performance.now();

    Debug.profiles[name].push(end - start);

    if (Debug.profiles[name].length === 60) {
      const average = Debug.profiles[name].reduce((a, b) => a + b) / 60;
      const rounded = Math.floor(average * 100) / 100;

      Debug.profiles[name] = [];

      console.log(`${ name }: ${ rounded }ms`)
    }
  }

  static ResetDrawCount() {
    (Sprite as any).drawCount = 0;
    (Container as any).drawCount = 0;
  }

  static GetDrawCount() {
    return (
      (Sprite as any).drawCount + 
      (Container as any).drawCount
    );
  }

  public static DebugStuff(state: BaseGameState) {
    if (state.keys.justDown.Z) {
      Debug.DebugMode = true;

      state.stage.x = 0;
      state.stage.y = 0;

      if (state.stage.scale.x === 0.2) {
        state.stage.scale = new Vector2({ x: 1, y: 1 });
      } else {
        state.stage.scale = new Vector2({ x: 0.2, y: 0.2 });
      }
    }

    if (Debug.DebugMode) {
      if (state.keys.down.W) {
        state.stage.y += 20;
      }

      if (state.keys.down.S) {
        state.stage.y -= 20;
      }

      if (state.keys.down.D) {
        state.stage.x -= 20;
      }

      if (state.keys.down.A) {
        state.stage.x += 20;
      }
    }
  }

  public static DebugShowRect(state: BaseGameState, rect: Rect) {
    state.stage.scale = new Vector2({ x: 0.2, y: 0.2 });
    state.stage.x = -rect.x * 0.2;
    state.stage.y = -rect.y * 0.2;
  }
}

(Sprite as any).drawCount = 0;

(Sprite.prototype as any).__render = (Sprite.prototype as any)._render;
(Sprite.prototype as any)._render = function (renderer: any) {
  (Sprite as any).drawCount++;
  this.__render(renderer);
};


(Sprite.prototype as any).__renderCanvas = (Sprite.prototype as any)._renderCanvas;
(Sprite.prototype as any)._renderCanvas = function (renderer: any) {
  (Sprite as any).drawCount++;
  this.__renderCanvas(renderer);
};


// PIXI.Container

(Container as any).drawCount = 0;

(Container.prototype as any).__render = (Container.prototype as any)._render;
(Container.prototype as any)._render = function (renderer: any) {
  (Container as any).drawCount++;
  this.__render(renderer);
};


(Container.prototype as any).__renderCanvas = (Container.prototype as any)._renderCanvas;
(Container.prototype as any)._renderCanvas = function (renderer: any) {
  (Container as any).drawCount++;
  this.__renderCanvas(renderer);
};