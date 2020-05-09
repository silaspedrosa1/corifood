export interface IBoundary {
  x: number;
  y: number;
  width: number;
  height: number;
}∏

export class Boundary implements IBoundary {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;

  constructor(args: { x: number; y: number; width: number; height: number }) {
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
  }
}
