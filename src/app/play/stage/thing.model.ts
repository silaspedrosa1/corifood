// import { COLORS, SHAPES } from "./constants";

import { ISprite, Sprite } from "./sprite.model";

export interface IThing {
  t0: number;
  acceleration: number;
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: ISprite;
}

export class Thing implements IThing {
  readonly t0: number;
  readonly acceleration: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly sprite: ISprite;

  constructor(args: IThing) {
    this.t0 = args.t0;
    this.acceleration = args.acceleration;
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.sprite = args.sprite;
  }

  fall(t: number) {
    const deltaT = (t - this.t0) / 1000;
    const y = (this.acceleration * Math.pow(deltaT, 2)) / 2;
    return new Thing({ ...this, y });
    // s = s0 + v0t + at^2/2
  }

  // spawn() {
  //   const typeId = this.randomizeTetrominoType(COLORS.length - 1);
  //   this.shape = SHAPES[typeId];
  //   this.color = COLORS[typeId];
  //   this.x = typeId === 4 ? 4 : 3;
  //   this.y = 0;
  // }

  // draw() {
  //   this.ctx.fillStyle = this.color;
  //   this.shape.forEach((row, y) => {
  //     row.forEach((value, x) => {
  //       if (value > 0) {
  //         this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
  //       }
  //     });
  //   });
  // }

  // drawNext(ctxNext: CanvasRenderingContext2D) {
  //   ctxNext.clearRect(0, 0, ctxNext.canvas.width, ctxNext.canvas.height);
  //   ctxNext.fillStyle = this.color;
  //   this.shape.forEach((row, y) => {
  //     row.forEach((value, x) => {
  //       if (value > 0) {
  //         ctxNext.fillRect(x, y, 1, 1);
  //       }
  //     });
  //   });
  // }

  // move(p: IThing) {
  //   this.x = p.x;
  //   this.y = p.y;
  //   this.shape = p.shape;
  // }

  // randomizeTetrominoType(noOfTypes: number): number {
  //   return Math.floor(Math.random() * noOfTypes + 1);
  // }
}
