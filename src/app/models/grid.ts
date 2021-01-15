import {BehaviorSubject} from 'rxjs';
import {Pos} from '../interfaces/pos';
import {Cell} from './cell';
import {CellState} from '../interfaces/cell-state';

export class Grid {
  public time = 0;
  private grid: Cell[][] = [];
  private updateSubject = new BehaviorSubject<Cell[][]>(null);
  public onUpdate$ = this.updateSubject.asObservable();

  constructor(private size = 50) {
    this.clear();
  }

  setCell(pos: Pos): void {
    if (this.grid[pos.i]?.[pos.j]) {
      this.grid[pos.i][pos.j].toggle();
    }
    this.resetHistory();
    this.updateSubject.next(this.grid);
  }

  getCell(pos: Pos): Cell {
    return this.grid[pos.i]?.[pos.j];
  }

  update(): void {
    // console.time('update');
    // Count neighbors
    this.grid.forEach((row, i) => row.forEach((cell, j) => {
      let neighbors = 0;
      for (let ni = i - 1; ni <= i + 1; ++ni) {
        for (let nj = j - 1; nj <= j + 1; ++nj) {
          if ((ni !== i || nj !== j) && this.grid[ni]?.[nj]?.isLiving()) {
            neighbors++;
          }
        }
      }
      cell.setNeighbors(neighbors);
    }));
    // Update cells
    this.grid.forEach(row => row.forEach(cell => {
      cell.update();
    }));
    // console.timeEnd('update');
    this.time++;
    this.updateSubject.next(this.grid);
  }

  clear(): void {
    this.grid = [];
    for (let i = 0; i < this.size; ++i) {
      const row: Cell[] = [];
      for (let j = 0; j < this.size; ++j) {
        row.push(new Cell((i + j) % 2 ? CellState.Living : CellState.Empty));
        // row.push(new Cell(0));
      }
      this.grid.push(row);
    }
    this.resetHistory();
    this.updateSubject.next(this.grid);
  }

  dumps(): string {
    console.log({
      size: this.size,
      grid: this.grid.map(row => row.map(cell => cell.getState()))
    });
    return JSON.stringify({
      size: this.size,
      grid: this.grid.map(row => row.map(cell => cell.getState()))
    });
  }

  loads(data: string): void {
    try {
      const obj: { size: number, grid: number[][] } = JSON.parse(data);
      this.size = obj.size;
      this.grid = obj.grid.map(row => row.map(cell => new Cell(cell)));
      this.updateSubject.next(this.grid);
    } catch (e) {
    }
  }

  private resetHistory(): void {
    this.time = 0;
    this.grid.forEach(row => row.forEach(cell => cell.resetHistory()));
  }
}
