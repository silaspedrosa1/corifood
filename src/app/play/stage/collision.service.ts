import { Injectable } from "@angular/core";

export enum CollisionStrategy {
  collideOnce,
  collideForever,
}
export class CollisionObserver {
  a: GameObject;
  b: GameObject;
  onCollision: () => void;
  collisionStrategy: CollisionStrategy = CollisionStrategy.collideOnce;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable()
export class CollisionService {
  private observers: CollisionObserver[] = [];

  register(observer: CollisionObserver) {
    this.observers.push(observer);
  }

  detect() {
    const callbacksQueue = this.observers.filter((o) =>
      this.doesOverlap(o.a, o.b)
    );
    callbacksQueue.forEach((c) => {
      c.onCollision();
      if (c.collisionStrategy === CollisionStrategy.collideOnce) {
        this.unregister(c);
      }
    });
  }

  unregister(observer: CollisionObserver) {
    const index = this.observers.indexOf(observer);
    if (index >= 0) this.observers.splice(index, 1);
  }

  private doesOverlap(a: GameObject, b: GameObject): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}
