export interface ISprite {
  width: number;
  height: number;
  img: any;
}

export class Sprite implements ISprite {
  public width: number;
  public height: number;
  public img: any;

  constructor(args: ISprite) {
    this.width = args.width;
    this.height = args.height;
    this.img = args.img;
  }
}
