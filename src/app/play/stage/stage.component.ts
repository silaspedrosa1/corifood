import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  HostListener,
} from "@angular/core";
import { COLS, BLOCK_SIZE, ROWS, KEY } from "../play.constants";
import { ThingsService } from "./things.service";
import { Character } from "./character.model";
import { Sprite } from "./sprite.model";
import { Boundary } from "./boundary.model";
import { CollisionService, CollisionStrategy } from "./collision.service";
import { ImageService } from "../image.service";
import { AudioService } from "../audio.service";

const THING_PRODUCTION_PROBABILITY = 0.05;

@Component({
  selector: "app-stage",
  templateUrl: "./stage.component.html",
  styleUrls: ["./stage.component.scss"],
  providers: [ThingsService, CollisionService, ImageService, AudioService],
})
export class StageComponent implements OnInit {
  // Get reference to the canvas.
  @ViewChild("board", { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild("boardContainer", { static: true })
  boardContainer: ElementRef<HTMLDivElement>;

  ctx: CanvasRenderingContext2D;
  canvasPosition: { x: number; y: number };
  canvasSize: { width: number; height: number };

  requestId: number;

  character: Character;
  leftWall: Boundary;
  rightWall: Boundary;
  floor: Boundary;

  hit: number;
  lost: number;

  constructor(
    public thingsService: ThingsService,
    private collisionService: CollisionService,
    private audioService: AudioService,
    private imageService: ImageService
  ) {}

  ngOnInit() {}

  async initBoard() {
    await Promise.all([this.audioService.init(), this.imageService.init()]);

    this.hit = 0;
    this.lost = 0;

    const canvasElement = this.canvas.nativeElement;
    this.ctx = canvasElement.getContext("2d");

    this.ctx.canvas.width = this.boardContainer.nativeElement.clientWidth;
    this.ctx.canvas.height = this.boardContainer.nativeElement.clientHeight;

    this.canvasSize = {
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height,
    };

    this.canvasPosition = {
      x: canvasElement.offsetLeft,
      y: canvasElement.offsetTop,
    };

    this.thingsService.init(this.canvasSize.width);

    const charSprite = new Sprite({
      img: this.imageService.images.goku,
      maxHeight: 150,
      maxWidth: 150,
    });
    this.character = new Character({
      x: this.canvasSize.width / 2,
      y: this.canvasSize.height - charSprite.height,
      sprite: charSprite,
    });

    this.leftWall = new Boundary({
      x: 0,
      y: 0,
      width: 0,
      height: this.canvasSize.height,
    });
    this.rightWall = new Boundary({
      x: this.canvasSize.width,
      y: 0,
      width: 0,
      height: this.canvasSize.height,
    });
    this.floor = new Boundary({
      x: 0,
      y: this.canvasSize.height,
      width: this.canvasSize.width,
      height: this.canvasSize.height,
    });

    this.collisionService.register({
      a: this.leftWall,
      b: this.character,
      collisionStrategy: CollisionStrategy.collideForever,
      onCollision: () => (this.character.x = 0),
    });
    this.collisionService.register({
      a: this.rightWall,
      b: this.character,
      collisionStrategy: CollisionStrategy.collideForever,
      onCollision: () =>
        (this.character.x = this.rightWall.x - this.character.width),
    });
  }

  async play() {
    console.log("play!");
    await this.initBoard();
    this.audioService.playAsBackgroundTrack(["bg1", "bg2"]);

    // If we have an old game running a game then cancel the old
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }

    this.animate();
  }

  animate(now = 0) {
    this.thingsService.fall(now);
    this.collisionService.detect();
    this.thingsService.cleanDisposed();

    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));

    if (Math.random() < THING_PRODUCTION_PROBABILITY) {
      const newThing = this.thingsService.produce();
      let floorCollision;
      let charCollision;
      floorCollision = this.collisionService.register({
        a: this.floor,
        b: newThing,
        collisionStrategy: CollisionStrategy.collideOnce,
        onCollision: () => {
          this.lost += 1;
          newThing.dispose();
          this.collisionService.unregisterAllWith(newThing);
          this.audioService.audioTracks.lost.playOnce();
        },
      });
      charCollision = this.collisionService.register({
        a: this.character,
        b: newThing,
        collisionStrategy: CollisionStrategy.collideOnce,
        onCollision: () => {
          this.hit += 1;
          newThing.dispose();
          this.collisionService.unregisterAllWith(newThing);
          this.audioService.audioTracks.hit.playOnce();
        },
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.thingsService.things.forEach((thing) => {
      this.ctx.drawImage(
        thing.sprite.img,
        thing.x,
        thing.y,
        thing.width,
        thing.height
      );
    });
    this.ctx.drawImage(
      this.character.sprite.img,
      this.character.x,
      this.character.y,
      this.character.width,
      this.character.height
    );
  }

  @HostListener("window:keydown", ["$event"])
  keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KEY.SPACE:
        this.play();
        break;
      case KEY.LEFT:
        this.character.moveLeft();
        break;
      case KEY.RIGHT:
        this.character.moveRight();
      default:
        break;
    }
  }
}
