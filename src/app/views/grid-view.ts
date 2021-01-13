import {Grid} from '../models/grid';
import {ElementRef} from '@angular/core';

export class GridView {
  private readonly ctx: CanvasRenderingContext2D;
  private x = 0;
  private y = 0;
  private cellSize = 10;

  constructor(canvas: ElementRef<HTMLCanvasElement>, grid: Grid) {
    this.ctx = canvas?.nativeElement?.getContext('2d');
    if (!this.ctx) {
      throw new Error('Canvas initialization error');
    }
    grid.onUpdate$.subscribe(g => this.draw(g));
  }

  draw(grid: number[][]): void {
    const width = this.ctx.canvas.width;
    const height = this.ctx.canvas.height;
    this.ctx.clearRect(0, 0, width, height);

    // Draw pos
    grid.forEach((row, i) => row.forEach((value, j) => {
      if (value === 1) {
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
      }
    }));

    // Draw grid
    this.ctx.beginPath();
    for (let x = 0; x <= width; x += this.cellSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += this.cellSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
    }
    this.ctx.stroke();
  }
}
