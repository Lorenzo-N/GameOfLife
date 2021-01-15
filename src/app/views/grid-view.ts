import {Pos} from '../interfaces/pos';
import {Game} from '../models/game';
import {ElementRef} from '@angular/core';
import {Subject} from 'rxjs';
import {Cell} from '../models/cell';
import {CellState} from '../interfaces/cell-state';

export class GridView {
  private readonly cellsColors = {
    [CellState.Empty]: '#ffffff',
    [CellState.IsolationDead]: '#ff000033',
    [CellState.OverpopulationDead]: '#ee770033',
    [CellState.Born]: '#007700',
    [CellState.Living]: '#00cc00'
  };
  private readonly gameCtx: CanvasRenderingContext2D;
  private readonly gridCtx: CanvasRenderingContext2D;
  private readonly hoverCtx: CanvasRenderingContext2D;
  private readonly tooltip: HTMLDivElement;
  private cellSize = 15;
  private requestId: number;
  private width: number;
  private height: number;
  private clickSubject = new Subject<Pos>();
  public onClick$ = this.clickSubject.asObservable();
  private tooltipPos: Pos = null;

  constructor(gameLayer: ElementRef<HTMLCanvasElement>, gridLayer: ElementRef<HTMLCanvasElement>,
              hoverLayer: ElementRef<HTMLCanvasElement>, tooltip: ElementRef<HTMLDivElement>, private grid: Game) {
    this.gameCtx = gameLayer?.nativeElement?.getContext('2d');
    this.gridCtx = gridLayer?.nativeElement?.getContext('2d');
    this.hoverCtx = hoverLayer?.nativeElement?.getContext('2d');
    if (!this.gameCtx || !this.gridCtx || !this.hoverCtx) {
      throw new Error('Canvas initialization error');
    }
    this.tooltip = tooltip.nativeElement;
    grid.onUpdate$.subscribe(g => {
      if (!this.requestId) {
        this.requestId = requestAnimationFrame(() => this.draw(g));
      }
      if (this.tooltipPos) {
        this.tooltip.innerText = this.grid.getCell(this.tooltipPos)?.getLivingTime() + '';
      }
    });
  }

  onClick(event: MouseEvent): void {
    this.clickSubject.next(this.mouseEventToPos(event));
  }

  onMouseMove(event: MouseEvent): void {
    const pos = this.mouseEventToPos(event);
    if (pos && pos.i * this.cellSize < this.width && pos.j * this.cellSize < this.height) {
      this.tooltipPos = pos;
      this.tooltip.style.visibility = 'visible';
      this.tooltip.innerText = this.grid.getCell(pos)?.getLivingTime() + '';
      this.tooltip.style.left = (pos.i * this.cellSize - 30) + 'px';
      this.tooltip.style.top = (pos.j * this.cellSize - 30) + 'px';
    } else {
      this.tooltip.style.visibility = 'hidden';
      this.tooltipPos = null;
    }
    this.drawHover(pos);
  }

  onMouseLeave(): void {
    this.drawHover();
    this.tooltip.style.visibility = 'hidden';
    this.tooltipPos = null;
  }

  private mouseEventToPos(event: MouseEvent): Pos {
    const rect = this.gameCtx.canvas.getBoundingClientRect();
    return {
      i: Math.floor((event.clientX - rect.left) / this.cellSize),
      j: Math.floor((event.clientY - rect.top) / this.cellSize)
    };
  }

  private draw(grid: Cell[][]): void {
    this.requestId = null;
    // console.time('draw');

    const width = this.gameCtx.canvas.width;
    const height = this.gameCtx.canvas.height;
    this.gameCtx.clearRect(0, 0, width, height);

    this.width = Math.min(width, this.cellSize * grid.length);
    this.height = Math.min(height, this.cellSize * grid[0].length);

    // Draw pos
    grid.forEach((row, i) => row.forEach((cell, j) => {
      this.gameCtx.fillStyle = this.cellsColors[cell.getState()];
      this.gameCtx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
    }));

    // Draw grid
    this.gridCtx.clearRect(0, 0, width, height);
    this.gridCtx.beginPath();
    for (let x = 0; x <= this.width; x += this.cellSize) {
      this.gridCtx.moveTo(x, 0);
      this.gridCtx.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += this.cellSize) {
      this.gridCtx.moveTo(0, y);
      this.gridCtx.lineTo(this.width, y);
    }
    this.gridCtx.stroke();
    // console.timeEnd('draw');
  }

  private drawHover(pos?: Pos): void {
    const ctx = this.hoverCtx;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);
    if (pos && pos.i * this.cellSize < this.width && pos.j * this.cellSize < this.height) {
      ctx.fillStyle = '#00000033';
      ctx.fillRect(pos.i * this.cellSize, pos.j * this.cellSize, this.cellSize, this.cellSize);
    }
  }
}
