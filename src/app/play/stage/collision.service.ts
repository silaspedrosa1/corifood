import { Injectable } from "@angular/core";

export class CollisionObserver {
  a: GameObject;
  b: GameObject;
  onCollision: () => void;
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
    callbacksQueue.forEach((c) => c.onCollision());
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
