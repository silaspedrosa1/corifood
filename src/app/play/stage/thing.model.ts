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
  status: ThingStatus;
}

export enum ThingStatus {
  falling,
  disposed,
}

export class Thing implements IThing {
  t0: number;
  acceleration: number;
  x: number;
  y: number;
  sprite: ISprite;
  status: ThingStatus = ThingStatus.falling;

  get width() {
    return this.sprite.width;
  }
  get height() {
    return this.sprite.height;
  }

  constructor(args: {
    t0: number;
    acceleration: number;
    x: number;
    y: number;
    sprite: ISprite;
  }) {
    this.t0 = args.t0;
    this.acceleration = args.acceleration;
    this.x = args.x;
    this.y = args.y;
    this.sprite = args.sprite;
  }

  fall(t: number) {
    const deltaT = (t - this.t0) / 1000;
    this.y = (this.acceleration * Math.pow(deltaT, 2)) / 2;
  }

  dispose() {
    this.status = ThingStatus.disposed;
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
