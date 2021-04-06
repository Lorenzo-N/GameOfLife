import {BehaviorSubject} from 'rxjs';
import {Pos} from '../interfaces/pos';
import {Cell} from './cell';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Game {
  public time = 0;
  public lastPopulation = 0;
  public population = 0;
  private initialGridDump: string;
  private grid: Cell[][] = [];
  private width = 100;
  private height = 50;
  private updateSubject = new BehaviorSubject<Cell[][]>(null);
  public onUpdate$ = this.updateSubject.asObservable();

  constructor() {
    this.clear();
  }

  // Set a cell with living value. If living is null, toggle the cell.
  setCell(pos: Pos, living: boolean = null): void {
    if (this.grid[pos.i]?.[pos.j]) {
      this.grid[pos.i][pos.j].set(living);
    }
    this.resetHistory();
    this.updateSubject.next(this.grid);
  }

  getCell(pos: Pos): Cell {
    return this.grid[pos.i]?.[pos.j];
  }

  getGrid(): Cell[][] {
    return this.grid;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  update(): void {
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
    // Update cells and info
    this.lastPopulation = this.population;
    this.population = 0;
    this.grid.forEach(row => row.forEach(cell => {
      cell.update();
      if (cell.isLiving()) {
        this.population++;
      }
    }));
    this.time++;
    this.updateSubject.next(this.grid);
  }

  clear(): void {
    this.grid = [];
    for (let i = 0; i < this.width; ++i) {
      const row: Cell[] = [];
      for (let j = 0; j < this.height; ++j) {
        // row.push(new Cell((i + j) % 2 ? CellState.Living : CellState.Empty));
        row.push(new Cell());
      }
      this.grid.push(row);
    }
    this.resetHistory();
    this.updateSubject.next(this.grid);
  }

  dumps(): string {
    return JSON.stringify({
      width: this.width,
      height: this.height,
      grid: this.grid.map(row => row.map(cell => cell.getState()))
    });
  }

  loads(data: string): void {
    try {
      const obj: { width: number, height: number, grid: number[][] } = JSON.parse(data);
      this.width = obj.width;
      this.height = obj.height;
      this.grid = obj.grid.map(row => row.map(cell => new Cell(cell)));
      this.resetHistory();
      this.updateSubject.next(this.grid);
    } catch (e) {
    }
  }

  resetInitialGrid(): void {
    this.loads(this.initialGridDump);
  }

  private resetHistory(): void {
    this.time = 0;
    this.population = 0;
    this.grid.forEach(row => row.forEach(cell => {
      cell.resetHistory();
      if (cell.isLiving()) {
        this.population++;
      }
    }));
    this.lastPopulation = this.population;
    this.initialGridDump = this.dumps();
  }
}
