import { Application, Renderer, Point } from "pixi.js";
import { Entity } from "./entity";
import { Debug } from "./debug";
import { HashSet } from "./data_structures/hash";
import { TypesafeLoader, AllResourcesType } from "./typesafe_loader";
import { CreateGame as ReactMountGame } from "./react/react_root";
import { Camera } from "./camera";
import { DebugFlagsType } from "./react/debug_flag_buttons";
import { CollisionHandler } from "./collision_handler";
import { Rect } from "./geometry/rect";
import { CoroutineManager } from "./coroutine_manager";
import { IGameState } from "Library";

export let GameReference: BaseGame<any>;

export type GameArgs = {
  scale       : number;
  canvasWidth : number;
  canvasHeight: number;
  tileHeight  : number;
  tileWidth   : number;
  debugFlags  : DebugFlagsType;
  state       : IGameState;
  assets      : TypesafeLoader<any>;
};

export class BaseGame<TResources extends AllResourcesType = {}> {
  app   : PIXI.Application;

  state : IGameState;

  /** 
   * The root of the display hierarchy for the game. Everything that exists in
   * the game that isn't fixed as the camera moves should be under this.
   */
  stage : Entity;

  /**
   * A stage for things in the game that don't move when the camera move and are
   * instead fixed to the screen. For example, the HUD.
   */
  fixedCameraStage: Entity;

  private assets: TypesafeLoader<TResources>;

  renderer: Renderer;

  camera: Camera;

  collisionHandler: CollisionHandler;

  coroutineManager: CoroutineManager;

  constructor(props: GameArgs) {
    GameReference = this;

    this.coroutineManager = new CoroutineManager();
    this.state = props.state;

    const view = document.getElementById('canvas');

    if (!view) {
      throw new Error("I couldn't find an element named #canvas on initialization. Giving up!")
    }

    this.collisionHandler = new CollisionHandler({
      canvasWidth : props.canvasWidth,
      canvasHeight: props.canvasHeight,
      tileHeight  : props.tileHeight,
      tileWidth   : props.tileWidth,
    });

    this.app = new Application({
      width          : props.canvasWidth,
      height         : props.canvasHeight,
      antialias      : true,
      transparent    : false,
      resolution     : window.devicePixelRatio,
      autoDensity    : true,
      backgroundColor: 0x000,
      view           : view as HTMLCanvasElement,
    });

    this.app.stage.scale = new Point(props.scale, props.scale);

    this.stage = new Entity({
      name: "Stage",
    });
    this.state.stage = this.stage;

    this.app.stage.addChild(this.stage.sprite);

    this.fixedCameraStage = new Entity({
      name: "FixedStage"
    });
    this.app.stage.addChild(this.fixedCameraStage.sprite);

    this.state.renderer = this.app.renderer;
    this.state.stage = this.stage;

    this.assets = props.assets;
    this.assets.onLoadComplete(() => this.startGameLoop());
    this.assets.onLoadComplete(() => this.initialize());

    this.renderer = this.app.renderer;

    this.camera = new Camera({
      stage       : this.stage,
      state       : this.state,
      canvasWidth : props.canvasWidth,
      canvasHeight: props.canvasHeight,
      bounds      : new Rect({ x: -1000, y: -1000, width: 6000, height: 6000 }),
    });

    ReactMountGame(this, props.debugFlags);

    this.stage.sprite.sortableChildren = true;
    this.fixedCameraStage.sprite.sortableChildren = true;
  }

  /**
   * Called after resources are finished loading.
   */
  initialize() {

  }

  startGameLoop = () => {
    this.app.ticker.add(() => this.gameLoop());
  };

  gameLoop = () => {
    const { entities } = this.state;

    Debug.Clear();

    this.state.keys.update();

    for (const entity of entities.values()) {
      entity.baseUpdate(this.state);
    }

    this.state.entities = new HashSet(entities.values().filter(ent => !this.state.toBeDestroyed.includes(ent)));

    for (const entity of this.state.toBeDestroyed) {
      if (entity.sprite.parent) {
        entity.sprite.parent.removeChild(entity.sprite);
      }
    }

    this.state.toBeDestroyed = [];

    const grid = this.collisionHandler.buildCollisionGrid({
      bounds  : new Rect({ x: 0, y: 0, width: 5000, height: 5000 }),
      entities: this.state.entities,
    });

    this.collisionHandler.resolveCollisions({
      entities: this.state.entities,
      grid    : grid,
    });

    this.camera.update(this.state);

    this.coroutineManager.updateCoroutines(this.state);

    Debug.ResetDrawCount();
  };
}