import { Injectable } from "@angular/core";

type Images = {
  cuscuz: HTMLImageElement;
  tapioca: HTMLImageElement;
  goku: HTMLImageElement;
};

@Injectable()
export class ImageService {
  images: Images = { cuscuz: null, tapioca: null, goku: null };

  async init() {
    const images = await Promise.all([
      this.build("assets/images/cuscuz.png"),
      this.build("assets/images/tapioca.jpeg"),
      this.build("assets/images/goku.png"),
    ]);
    this.images.cuscuz = images[0];
    this.images.tapioca = images[1];
    this.images.goku = images[2];
  }

  build(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
    });
  }
}
