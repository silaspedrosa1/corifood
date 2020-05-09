import { Injectable } from "@angular/core";
import { Thing, ThingStatus } from "./thing.model";
import { Sprite } from "./sprite.model";
import { sampleArray, sampleInRange } from "src/app/shared/random";

const NEW_THING_TICK = 1000;
const DEFAULT_GRAVITY = 400;
const MAX_THING_WIDTH = 150;
const MAX_THING_HEIGHT = 150;

const cuscuzImg = new Image();
cuscuzImg.src = "assets/images/cuscuz.png";
const tapiocaImg = new Image();
tapiocaImg.src = "assets/images/tapioca.jpeg";

const sprites: Sprite[] = [
  new Sprite({
    maxHeight: MAX_THING_HEIGHT,
    maxWidth: MAX_THING_WIDTH,
    img: cuscuzImg,
  }),
  new Sprite({
    maxHeight: MAX_THING_HEIGHT,
    maxWidth: MAX_THING_WIDTH,
    img: tapiocaImg,
  }),
];

const things: (() => Thing)[] = [
  () =>
    new Thing({
      acceleration: DEFAULT_GRAVITY,
      sprite: sprites[0],
      t0: performance.now(),
      x: sampleInRange(0, 500),
      y: 0,
    }),
  () =>
    new Thing({
      acceleration: DEFAULT_GRAVITY,
      sprite: sprites[1],
      t0: performance.now(),
      x: sampleInRange(0, 500),
      y: 0,
    }),
];

@Injectable()
export class ThingsService {
  intervalRef;
  private _things: Thing[] = [];
  get things() {
    return this._things;
  }

  produce(): Thing {
    const newThing = sampleArray(things)();
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
