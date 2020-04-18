import { Entity } from "./entity";
import { Vector2 } from "./geometry/vector2";
import { CollisionGrid } from "./collision_grid";
import { HashSet } from "./data_structures/hash";
import { Rect } from "./geometry/rect";

export class CollisionHandler {
  private _canvasWidth : number;
  private _canvasHeight: number;
  private _tileSize     : number;
  
  constructor(props: {
    canvasWidth : number;
    canvasHeight: number;
    tileWidth   : number;
    tileHeight  : number;
  }) {
    if (props.tileWidth !== props.tileHeight) {
      throw new Error("Collision handler does not currently support tileWidth != tileHeight");
    }

    this._canvasWidth  = props.canvasWidth;
    this._canvasHeight = props.canvasHeight;
    this._tileSize      = props.tileWidth;
  }

  buildCollisionGrid = (props: {
    entities: HashSet<Entity>;
    bounds             : Rect;
  }): CollisionGrid => {
    const { entities, bounds } = props;

    const grid = new CollisionGrid({
      width   : 2 * this._canvasWidth,
      height  : 2 * this._canvasHeight,
      cellSize: 8 * this._tileSize,
      debug   : false,
    });

    const collideableEntities = entities.values().filter(x => x.isCollideable());

    for (const entity of collideableEntities) {
      if (entity.bounds().intersects(bounds)) {
        grid.addRectGroup(entity.bounds(), entity);
      }
    }

    return grid;
  };

  resolveCollisions = (props: {
    entities: HashSet<Entity>;
    grid    : CollisionGrid;
  }) => {
    const { entities, grid } = props;

    for (const entity of entities.values()) {
      if (entity.velocity.x === 0 && entity.velocity.y === 0) { continue; }

      let updatedBounds = entity.bounds();

      const xVelocity = new Vector2({ x: entity.velocity.x, y: 0 });
      const yVelocity = new Vector2({ x: 0, y: entity.velocity.y });

      let delta = Vector2.Zero;

      // resolve x-axis

      delta = delta.add(xVelocity);
      updatedBounds = updatedBounds.add(xVelocity);

      if (grid.getRectGroupCollisions(updatedBounds, entity).length > 0) {
        delta = delta.subtract(xVelocity);
        updatedBounds = updatedBounds.subtract(xVelocity);
      }

      // resolve y-axis

      delta = delta.add(yVelocity);
      updatedBounds = updatedBounds.add(yVelocity);

      if (grid.getRectGroupCollisions(updatedBounds, entity).length > 0) {
        delta = delta.subtract(yVelocity);
        updatedBounds = updatedBounds.subtract(yVelocity);
      }

      entity.x = entity.x + delta.x;
      entity.y = entity.y + delta.y;
    }
  };
}