import { Line } from "./line";
import { Vector2, IVector2 } from "./vector2";

/**
 * Immutable rectangle class.
 */
export class Rect {
  private _x     : number;
  private _y     : number;
  private _width : number;
  private _height: number;

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get w(): number {
    return this._width;
  }

  public get h(): number {
    return this._height;
  }

  public get centerX(): number {
    return this._x + this._width / 2;
  }

  public get centerY(): number {
    return this._y + this._height / 2;
  }

  public get right(): number {
    return this._x + this._width;
  }

  public get bottom(): number {
    return this._y + this._height;
  }

  public get top(): number {
    return this._y;
  }

  public get left(): number {
    return this._x;
  }

  public get center(): Vector2 {
    return new Vector2({ x: this.x + this.w / 2, y: this.y + this.h / 2 });
  }

  public get dimensions(): Vector2 {
    return new Vector2({ x: this.w, y: this.h });
  }

  public static FromPoint(point: IVector2, size: number): Rect {
    return new Rect({
      x: point.x,
      y: point.y,
      width: size,
      height: size
    });
  }

  public static FromPoints(p1: IVector2, p2: IVector2): Rect {
    return new Rect({
      x: Math.min(p1.x, p2.x),
      y: Math.min(p1.y, p2.y),
      width: Math.abs(p1.x - p2.x),
      height: Math.abs(p1.y - p2.y)
    });
  }

  public withRight(value: number): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      width: value - this.x,
      height: this.h
    });
  }

  public withWidth(value: number): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      width: value,
      height: this.h
    });
  }

  public withHeight(value: number): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      width: this.w,
      height: value
    });
  }

  public withBottom(value: number): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      width: this.w,
      height: value - this.y
    });
  }

  public withX(value: number): Rect {
    return new Rect({
      x: value,
      y: this.y,
      width: this.w,
      height: this.h
    });
  }

  public withY(value: number): Rect {
    return new Rect({
      x: this.x,
      y: value,
      width: this.w,
      height: this.h
    });
  }

  public withTop(value: number): Rect {
    return this.withY(value);
  }

  public withLeft(value: number): Rect {
    return this.withX(value);
  }

  /**
   * bottomRight is held constant.
   */
  public withTopLeft(topLeft: IVector2): Rect {
    return Rect.FromPoints(topLeft, this.bottomRight);
  }

  /**
   * bottomLeft is held constant.
   */
  public withTopRight(topRight: IVector2): Rect {
    return Rect.FromPoints(topRight, this.bottomLeft);
  }

  /**
   * topLeft is held constant.
   */
  public withBottomRight(bottomRight: IVector2): Rect {
    return Rect.FromPoints(bottomRight, this.topLeft);
  }

  /**
   * topRight is held constant.
   */
  public withBottomLeft(bottomLeft: IVector2): Rect {
    return Rect.FromPoints(bottomLeft, this.topRight);
  }

  public get topLeft(): Vector2 {
    return new Vector2({
      x: this.x,
      y: this.y
    });
  }

  public get topRight(): Vector2 {
    return new Vector2({
      x: this.right,
      y: this.y
    });
  }

  public get bottomRight(): Vector2 {
    return new Vector2({
      x: this.right,
      y: this.bottom
    });
  }

  public get bottomLeft(): Vector2 {
    return new Vector2({
      x: this.x,
      y: this.bottom
    });
  }

  constructor(props: { x: number; y: number; width: number; height: number }) {
    this._x      = props.x;
    this._y      = props.y;
    this._width  = props.width;
    this._height = props.height;
  }

  static DeserializeRect(s: string): Rect {
    const [x, y, w, h] = s.split("|").map(x => Number(x));

    return new Rect({ x, y, width: w, height: h });
  }

  /**
   * Return the four edges of this Rect as Lines.
   */
  getLinesFromRect(): Line[] {
    return [
      new Line({ x1: this.x, y1: this.y, x2: this.x + this.w, y2: this.y }),
      new Line({ x1: this.x, y1: this.y, x2: this.x, y2: this.y + this.h }),
      new Line({
        x1: this.x + this.w,
        y1: this.y + this.h,
        x2: this.x + this.w,
        y2: this.y
      }),
      new Line({
        x1: this.x + this.w,
        y1: this.y + this.h,
        x2: this.x,
        y2: this.y + this.h
      })
    ];
  }

  /**
   * Return the four corners of this Rect.
   */
  getCorners(): Vector2[] {
    return [
      new Vector2({ x: this.x, y: this.y }),
      new Vector2({ x: this.x + this.w, y: this.y }),
      new Vector2({ x: this.x, y: this.y + this.h }),
      new Vector2({ x: this.x + this.w, y: this.y + this.h })
    ];
  }

  serialize(): string {
    return `${this.x}|${this.y}|${this.w}|${this.h}`;
  }

  // consider overlapping edges as intersection, but not overlapping corners.
  intersects(
    other: Rect,
    props: { edgesOnlyIsAnIntersection: boolean } = { edgesOnlyIsAnIntersection: false }
  ): boolean {
    const intersection = this.getIntersection(other, true);

    if (props.edgesOnlyIsAnIntersection) {
      return !!intersection && (intersection.w > 0 || intersection.h > 0);
    } else {
      return !!intersection && intersection.w * intersection.h > 0;
    }
  }

  completelyContains(smaller: Rect): boolean {
    return (
      this.x <= smaller.x &&
      this.x + this.w >= smaller.x + smaller.w &&
      this.y <= smaller.y &&
      this.y + this.h >= smaller.y + smaller.h
    );
  }

  getIntersection(
    other: Rect,
    edgesOnlyIsAnIntersection = false
  ): Rect | undefined {
    const xmin = Math.max(this.x, other.x);
    const xmax1 = this.x + this.w;
    const xmax2 = other.x + other.w;
    const xmax = Math.min(xmax1, xmax2);

    if (xmax > xmin || (edgesOnlyIsAnIntersection && xmax >= xmin)) {
      const ymin = Math.max(this.y, other.y);
      const ymax1 = this.y + this.h;
      const ymax2 = other.y + other.h;
      const ymax = Math.min(ymax1, ymax2);

      if (ymax >= ymin || (edgesOnlyIsAnIntersection && ymax >= ymin)) {
        return new Rect({
          x: xmin,
          y: ymin,
          width: xmax - xmin,
          height: ymax - ymin
        });
      }
    }

    return undefined;
  }

  contains(p: Vector2): boolean {
    return (
      p.x >= this.x &&
      p.x < this.x + this.w &&
      p.y >= this.y &&
      p.y < this.y + this.h
    );
  }

  clone(): Rect {
    return new Rect({ x: this.x, y: this.y, width: this.w, height: this.h });
  }

  add(p: IVector2): Rect {
    return this.translate(p);
  }

  subtract(p: IVector2): Rect {
    return this.translate({ x: -p.x, y: -p.y });
  }


  translate(p: IVector2): Rect {
    return new Rect({
      x: this.x + p.x,
      y: this.y + p.y,
      width: this.w,
      height: this.h
    });
  }

  scale(p: Vector2): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      width: this.w * p.x,
      height: this.h * p.y
    });
  }

  centeredAtOrigin(): Rect {
    return new Rect({
      x: -this.w / 2,
      y: -this.h / 2,
      width: this.w,
      height: this.h
    });
  }

  equals(o: Rect | undefined | null): boolean {
    if (!o) {
      return false;
    }

    return this.x === o.x && this.y === o.y && this.w === o.w && this.h === o.h;
  }

  toJSON(): any {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      reviver: "Rect"
    };
  }

  /**
   * Adds amount to both width and height.
   */
  extend(amount: number): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      width: this.w + amount,
      height: this.h + amount
    });
  }

  shrink(amount: number): Rect {
    return new Rect({
      x: this.x + amount,
      y: this.y + amount,
      width: Math.max(this.w - amount * 2, 0),
      height: Math.max(this.h - amount * 2, 0)
    });
  }

  floor(): Rect {
    return new Rect({
      x: Math.floor(this.x),
      y: Math.floor(this.y),
      width: Math.floor(this.w),
      height: Math.floor(this.h)
    });
  }

  /**
   * Grow the Rect by amount in all directions.
   */
  expand(amount: number): Rect {
    return this.shrink(-amount);
  }

  transform(trans: Vector2, scale: number): Rect {
    const topLeft = this.topLeft.transform(trans, scale);
    const botRight = this.bottomRight.transform(trans, scale);

    return new Rect({
      x: topLeft.x,
      y: topLeft.y,
      width: botRight.x - topLeft.x,
      height: botRight.y - topLeft.y
    });
  }

  static Deserialize(obj: any): Rect {
    if (
      !obj.hasOwnProperty("x") ||
      !obj.hasOwnProperty("y") ||
      !obj.hasOwnProperty("w") ||
      !obj.hasOwnProperty("h")
    ) {
      console.error("Failed deserializing Rect");
    }

    return new Rect({
      x: obj.x,
      y: obj.y,
      width: obj.w,
      height: obj.h
    });
  }

  static Serialize(r: Rect): string {
    return JSON.stringify({
      x: r.x,
      y: r.y,
      w: r.w,
      h: r.h
    });
  }

  toString(): string {
    return `[${this.x}, ${this.y}]`;
  }
}
