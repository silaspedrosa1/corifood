import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { COLS, BLOCK_SIZE, ROWS } from "../play.constants";
import { ThingsService } from "./things.service";
import { Character } from "./character.model";
import { Sprite } from "./sprite.model";

const charImg = new Image();
charImg.src = "assets/images/goku.png";
const charSprite = new Sprite({
  img: charImg,
  maxHeight: 150,
  maxWidth: 150,
});

@Component({
  selector: "app-stage",
  templateUrl: "./stage.component.html",
  styleUrls: ["./stage.component.scss"],
  providers: [ThingsService],
})
export class StageComponent implements OnInit {
  // Get reference to the canvas.
  @ViewChild("board", { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild("boardContainer", { static: true })
  boardContainer: ElementRef<HTMLDivElement>;

  ctx: CanvasRenderingContext2D;
  requestId: number;

  character: Character;
  canvasPosition: { x: number; y: number };
  canvasSize: { width: number; height: number };

  constructor(public thingsService: ThingsService) {}

  ngOnInit() {}

  initBoard() {
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

    this.character = new Character({
      x: this.canvasSize.width / 2,
      y: this.canvasSize.height - charSprite.height,
      sprite: charSprite,
    });
  }

  play() {
    console.log("play!");
    this.initBoard();
    this.thingsService.start();

    // If we have an old game running a game then cancel the old
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }

    this.animate();
  }

  animate(now = 0) {
    this.thingsService.fall(now);
    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
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
}
