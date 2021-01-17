import {Game} from '../models/game';
import {ElementRef} from '@angular/core';
import {SettingsService} from '../services/settings.service';
import {GridInfo} from '../interfaces/grid-info';

export class GridLayer {
  private readonly ctx: CanvasRenderingContext2D;

  constructor(canvas: ElementRef<HTMLCanvasElement>, private gridInfo: GridInfo,
              private game: Game, private settings: SettingsService) {
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
    if (this.settings.grid) {
      this.ctx.beginPath();
      for (let x = 0; x <= this.gridInfo.width; x += this.gridInfo.cellSize) {
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.gridInfo.height);
      }
      for (let y = 0; y <= this.gridInfo.height; y += this.gridInfo.cellSize) {
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.gridInfo.width, y);
      }
      this.ctx.stroke();
    }
  }
}
