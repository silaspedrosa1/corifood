import { Injectable } from "@angular/core";
import { Thing } from "./thing.model";
import { Sprite } from "./sprite.model";
import { sampleArray, sampleInRange } from "src/app/shared/random";

const NEW_THING_TICK = 1000;
const DEFAULT_GRAVITY = 400;
const MAX_Y = 500;

const cuscuzImg = new Image();
cuscuzImg.src = "assets/images/cuscuz.png";
const tapiocaImg = new Image();
tapiocaImg.src = "assets/images/tapioca.jpeg";

const sprites: Sprite[] = [
  new Sprite({ height: 628, width: 1200, img: cuscuzImg }),
  new Sprite({ height: 156, width: 324, img: tapiocaImg }),
];

const things: (() => Thing)[] = [
  () =>
    new Thing({
      acceleration: DEFAULT_GRAVITY,
      height: 100,
      width: 100,
      sprite: sprites[0],
      t0: performance.now(),
      x: sampleInRange(0, 500),
      y: 0,
    }),
  () =>
    new Thing({
      acceleration: DEFAULT_GRAVITY,
      height: 100,
      width: 100,
      sprite: sprites[1],
      t0: performance.now(),
      x: sampleInRange(0, 500),
      y: 0,
    }),
];

@Injectable()
export class StageService {
  intervalRef;
  public things: Thing[] = [];
  public oldThings: Thing[] = [];

  constructor() {
    this.things.push(sampleArray(things)());
    this.intervalRef = setInterval(() => {
      this.things.push(sampleArray(things)());
    }, NEW_THING_TICK);
  }

  fall(now: number) {
    const things = this.things.map((t) => t.fall(now));
    this.oldThings = things.filter((t) => !this.isValid(t));
    this.things = things.filter((t) => this.isValid(t));
  }

  isValid(thing: Thing): boolean {
    return thing.y <= MAX_Y;
  }
}
