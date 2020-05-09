export interface ISprite {
  width: number;
  height: number;
  img: any;
}

export class Sprite implements ISprite {
  public width: number;
  public height: number;
  public img: any;

  constructor(args: { img: any; maxWidth: number; maxHeight: number }) {
    console.log(args.img);

    const newSize = this.calculateAspectRatioFit(
      args.img.width,
      args.img.height,
      args.maxWidth,
      args.maxHeight
    );
    console.log(newSize);

    this.width = newSize.width;
    this.height = newSize.height;
    this.img = args.img;
  }

  /**
   * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
   * images to fit into a certain area.
   *
   * @param {Number} srcWidth width of source image
   * @param {Number} srcHeight height of source image
   * @param {Number} maxWidth maximum available width
   * @param {Number} maxHeight maximum available height
   * @return {Object} { width, height }
   */
  private calculateAspectRatioFit(
    srcWidth,
    srcHeight,
    maxWidth,
    maxHeight
  ): { width: number; height: number } {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }
}
