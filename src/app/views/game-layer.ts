import {Game} from '../models/game';
import {ElementRef} from '@angular/core';
import {SettingsService} from '../services/settings.service';
import {GridInfo} from '../interfaces/grid-info';

export class GameLayer {
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
    this.game.getGrid().forEach((row, i) => row.forEach((cell, j) => {
      const color = this.settings.getCellColor(cell);
      if (color) {
        this.ctx.fillStyle = color;
        if (this.settings.circles) {
          this.ctx.beginPath();
          this.ctx.arc(this.gridInfo.x + i * this.gridInfo.cellSize + this.gridInfo.cellSize / 2,
            this.gridInfo.y + j * this.gridInfo.cellSize + this.gridInfo.cellSize / 2, this.gridInfo.cellSize / 2 - 1, 0, 2 * Math.PI);
          this.ctx.fill();
        } else {
          this.ctx.fillRect(this.gridInfo.x + i * this.gridInfo.cellSize,
            this.gridInfo.y + j * this.gridInfo.cellSize, this.gridInfo.cellSize, this.gridInfo.cellSize);
        }
      }
    }));
  }

  getCanvas(): HTMLCanvasElement {
    return this.ctx.canvas;
  }
}
