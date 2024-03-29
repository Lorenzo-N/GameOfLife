import {Game} from '../models/game';
import {ElementRef} from '@angular/core';
import {GridInfo} from '../interfaces/grid-info';
import {Settings} from '../models/settings';

export class GridLayer {
  /**
   * Layer della vista che si occupa di disegnare la griglia di gioco.
   */
  private readonly ctx: CanvasRenderingContext2D;

  constructor(canvas: ElementRef<HTMLCanvasElement>, private gridInfo: GridInfo,
              private game: Game, private settings: Settings) {
    this.ctx = canvas?.nativeElement?.getContext('2d');
    if (!this.ctx) {
      throw new Error('Canvas initialization error');
    }
  }

  draw(updateSize: boolean): void {
    if (updateSize) {
      this.ctx.canvas.width = this.gridInfo.canvasWidth;
      this.ctx.canvas.height = this.gridInfo.canvasHeight;
    }
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.strokeStyle = '#7a7a7a';
    this.ctx.beginPath();
    if (this.settings.grid) {
      // In base ai settings disegna la griglia
      for (let x = 0; x <= this.gridInfo.width; x += this.gridInfo.cellSize) {
        this.ctx.moveTo(this.gridInfo.x + x, this.gridInfo.y);
        this.ctx.lineTo(this.gridInfo.x + x, this.gridInfo.y + this.gridInfo.height);
      }
      for (let y = 0; y <= this.gridInfo.height; y += this.gridInfo.cellSize) {
        this.ctx.moveTo(this.gridInfo.x, this.gridInfo.y + y);
        this.ctx.lineTo(this.gridInfo.x + this.gridInfo.width, this.gridInfo.y + y);
      }
    } else {
      // Oppure soltanto i bordi
      this.ctx.moveTo(this.gridInfo.x, this.gridInfo.y);
      this.ctx.lineTo(this.gridInfo.x + this.gridInfo.width, this.gridInfo.y);
      this.ctx.lineTo(this.gridInfo.x + this.gridInfo.width, this.gridInfo.y + this.gridInfo.height);
      this.ctx.lineTo(this.gridInfo.x, this.gridInfo.y + this.gridInfo.height);
      this.ctx.lineTo(this.gridInfo.x, this.gridInfo.y);
    }
    this.ctx.stroke();
  }
}
