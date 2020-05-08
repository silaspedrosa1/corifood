import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { COLS, BLOCK_SIZE, ROWS } from "../play.constants";
import { StageService } from "./stage.service";

@Component({
  selector: "app-stage",
  templateUrl: "./stage.component.html",
  styleUrls: ["./stage.component.scss"],
  providers: [StageService],
})
export class StageComponent implements OnInit {
  // Get reference to the canvas.
  @ViewChild("board", { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  requestId: number;

  constructor(public stageService: StageService) {}

  ngOnInit() {
    this.initBoard();
    // this.resetGame();
  }

  initBoard() {
    // Get the 2D context that we draw on.
    this.ctx = this.canvas.nativeElement.getContext("2d");

    // Calculate size of canvas from constants.
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    // Scale so we don't need to give size on every draw.
    // this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  play() {
    // this.resetGame();
    // this.piece = new Piece(this.ctx);
    // this.next.drawNext(this.ctxNext);
    // this.time.start = performance.now();

    // If we have an old game running a game then cancel the old
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }

    this.animate();
  }

  animate(now = 0) {
    this.stageService.fall(now);
    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.stageService.things.forEach((thing) => {
      console.log("drawing", thing);
      this.ctx.drawImage(
        thing.sprite.img,
        thing.x,
        thing.y,
        thing.width,
        thing.height
      );
    });
  }
}
