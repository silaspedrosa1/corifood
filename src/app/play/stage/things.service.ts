import { Injectable } from "@angular/core";
import { Thing, ThingStatus } from "./thing.model";
import { Sprite } from "./sprite.model";
import { sampleArray, sampleInRange } from "src/app/shared/random";
import { ImageService } from "../image.service";

const DEFAULT_GRAVITY = 400;
const MAX_THING_WIDTH = 150;
const MAX_THING_HEIGHT = 150;

@Injectable()
export class ThingsService {
  sprites: Sprite[];
  possibleThings: (() => Thing)[];
  intervalRef;
  private _things: Thing[] = [];
  get things() {
    return this._things;
  }

  constructor(private imageService: ImageService) {}

  init(canvasWidth: number) {
    this.sprites = [
      new Sprite({
        maxHeight: MAX_THING_HEIGHT,
        maxWidth: MAX_THING_WIDTH,
        img: this.imageService.images.cuscuz,
      }),
      new Sprite({
        maxHeight: MAX_THING_HEIGHT,
        maxWidth: MAX_THING_WIDTH,
        img: this.imageService.images.tapioca,
      }),
    ];

    this.possibleThings = [
      () => {
        const sprite = this.sprites[0];
        return new Thing({
          acceleration: DEFAULT_GRAVITY,
          sprite: sprite,
          t0: performance.now(),
          x: sampleInRange(0, canvasWidth - sprite.width),
          y: 0,
        });
      },
      () => {
        const sprite = this.sprites[1];
        return new Thing({
          acceleration: DEFAULT_GRAVITY,
          sprite: sprite,
          t0: performance.now(),
          x: sampleInRange(0, canvasWidth - sprite.width),
          y: 0,
        });
      },
    ];
  }

  produce(): Thing {
    const newThing = sampleArray(this.possibleThings)();
    this._things.push(newThing);
    return newThing;
  }

  cleanDisposed() {
    this._things = this._things.filter((t) => t.status === ThingStatus.falling);
  }

  fall(now: number) {
    this._things.forEach((t) => t.fall(now));
  }
}
