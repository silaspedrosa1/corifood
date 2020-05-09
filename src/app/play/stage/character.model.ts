// import { COLORS, SHAPES } from "./constants";

import { ISprite, Sprite } from "./sprite.model";

export interface ICharacter {
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: ISprite;
}

export class Character implements ICharacter {
  readonly x: number;
  readonly y: number;
  readonly sprite: ISprite;
  get width() {
    return this.sprite.width;
  }
  get height() {
    return this.sprite.height;
  }

  constructor(args: { x: number; y: number; sprite: ISprite }) {
    this.x = args.x;
    this.y = args.y;
    this.sprite = args.sprite;
  }
}
