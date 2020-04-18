import { Vector2 } from "./geometry/vector2";
import { Entity } from "./entity";
import { Rect } from "./geometry/rect";
import { Debug } from "./debug";
import { IGameState } from "Library";

export class Camera {
  private static LERP_SPEED = 0.09;

  /**
   * Top left coordinate of the camera.
   */
  private _position        = Vector2.Zero;
  private _desiredPosition = Vector2.Zero;
  private _stage           : Entity;
  private _canvasWidth     : number;
  private _canvasHeight    : number;
  private _currentBounds   : Rect;

  constructor(props: { 
    stage       : Entity;
    state       : IGameState;
    canvasWidth : number; 
    canvasHeight: number;
    bounds      : Rect;
  }) {
    this._stage         = props.stage;
    this._canvasWidth   = props.canvasWidth;
    this._canvasHeight  = props.canvasHeight;
    this._currentBounds = props.bounds;

    this._immediatelyCenterOn(new Vector2({ x: props.canvasWidth / 2, y: props.canvasHeight / 2 }));

    this._desiredPosition = this._position;
  }

  public get center(): Vector2 {
    return new Vector2({
      x: this._position.x + this._canvasWidth / 2,
      y: this._position.y + this._canvasHeight / 2
    });
  }

  public bounds(): Rect {
    return new Rect({
      x: this.center.x - this._canvasWidth / 2,
      y: this.center.y - this._canvasHeight / 2,
      width: this._canvasWidth,
      height: this._canvasHeight,
    });
  }

  private halfDimensions(): Vector2 {
    return new Vector2({
      x: this._canvasWidth / 2,
      y: this._canvasHeight / 2
    });
  }

  private _immediatelyCenterOn = (position: Vector2) => {
    this._position = position.subtract(this.halfDimensions());
  };

  centerOn = (position: Vector2) => {
    this._desiredPosition = position.subtract(this.halfDimensions());
  };

  // currentRegion(): Rect | undefined {
  //   const mapRegions = this._state.map.getCameraRegions();

  //   return mapRegions.find(region => region.contains(this._target.positionVector()));
  // }

  calculateDesiredPosition = (): Vector2 => {
    let desiredPosition = this._desiredPosition;

    const currentBounds = this._currentBounds;

    if (!currentBounds) {
      console.error("no region for camera!");

      return desiredPosition;
    }

    if (currentBounds.w < this._canvasWidth || currentBounds.h < this._canvasHeight) {
      throw new Error("There is a region on the map which is too small for the camera.");
    }

    // fit the camera rect into the regions rect

    if (desiredPosition.x < currentBounds.left) {
      desiredPosition = desiredPosition.withX(currentBounds.left);
    }

    if (desiredPosition.x + this.bounds().w > currentBounds.right) {
      desiredPosition = desiredPosition.withX(currentBounds.right - this._canvasWidth);
    }

    if (desiredPosition.y < currentBounds.top) {
      desiredPosition = desiredPosition.withY(currentBounds.top);
    }

    if (desiredPosition.y + this.bounds().h > currentBounds.bottom) {
      desiredPosition = desiredPosition.withY(currentBounds.bottom - this._canvasHeight);
    }

    return desiredPosition;
  };

  update = (state: IGameState) => {
    if (Debug.DebugMode) {
      return;
    }

    const desiredPosition = this.calculateDesiredPosition();

    this._position = this._position.lerp(desiredPosition, Camera.LERP_SPEED);

    this._stage.x = Math.floor(-this._position.x);
    this._stage.y = Math.floor(-this._position.y);
  };
}