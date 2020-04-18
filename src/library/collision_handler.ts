import { Entity } from "./entity";
import { Vector2 } from "./geometry/vector2";
import { CollisionGrid, CollisionResultRect } from "./collision_grid";
import { HashSet } from "./data_structures/hash";
import { Rect } from "./geometry/rect";

export type HitInfo = { 
  hit        : boolean; 
  left      ?: boolean;
  right     ?: boolean;
  up        ?: boolean;
  down      ?: boolean;
  collisions : CollisionResultRect[];
};

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
      const collisionRect = entity.collisionBounds().add(entity.position);

      if (collisionRect.intersects(bounds)) {
        const rectOrRectGroup = collisionRect;

        if (rectOrRectGroup instanceof Rect) {
          grid.add(rectOrRectGroup, entity);
        } else {
          grid.addRectGroup(rectOrRectGroup, entity);
        }
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
      const hitInfo: HitInfo = { 
        hit: false, 
        collisions: [],
      };

      if (entity.velocity.x === 0 && entity.velocity.y === 0) { continue; }

      let updatedBounds = entity.collisionBounds().add(entity.position);

      const xVelocity = new Vector2({ x: entity.velocity.x, y: 0 });
      const yVelocity = new Vector2({ x: 0, y: entity.velocity.y });

      let delta = Vector2.Zero;

      // resolve x-axis

      delta = delta.add(xVelocity);
      updatedBounds = updatedBounds.add(xVelocity);

      const xCollisions =
        updatedBounds instanceof Rect 
          ? grid.getRectCollisions(updatedBounds, entity) 
          : grid.getRectGroupCollisions(updatedBounds, entity);

      if (xCollisions.length > 0) {
        hitInfo.hit        = true;
        hitInfo.right      = entity.velocity.x > 0;
        hitInfo.left       = entity.velocity.x < 0;
        hitInfo.collisions = [...hitInfo.collisions, ...xCollisions];

        delta = delta.subtract(xVelocity);
        updatedBounds = updatedBounds.subtract(xVelocity);
      }

      // resolve y-axis

      delta = delta.add(yVelocity);
      updatedBounds = updatedBounds.add(yVelocity);

      const yCollisions =
        updatedBounds instanceof Rect 
          ? grid.getRectCollisions(updatedBounds, entity) 
          : grid.getRectGroupCollisions(updatedBounds, entity);


      if (yCollisions.length > 0) {
        hitInfo.hit        = true;
        hitInfo.up         = entity.velocity.y < 0;
        hitInfo.down       = entity.velocity.y > 0;
        hitInfo.collisions = [...hitInfo.collisions, ...yCollisions];

        delta = delta.subtract(yVelocity);
        updatedBounds = updatedBounds.subtract(yVelocity);
      }

      entity.hitInfo = hitInfo;

      entity.x = entity.x + delta.x;
      entity.y = entity.y + delta.y;
    }
  };
}