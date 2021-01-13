import {BehaviorSubject} from 'rxjs';
import {Pos} from './pos';
import {Cell} from './cell';

export class Grid {
  private readonly grid: Cell[][] = [];
  private updateSubject = new BehaviorSubject<Cell[][]>(null);
  public onUpdate$ = this.updateSubject.asObservable();

  constructor(private size = 50) {
    for (let i = 0; i < this.size; ++i) {
      const row: Cell[] = [];
      for (let j = 0; j < this.size; ++j) {
        // row.push(new Cell((i + j) % 2));
        row.push(new Cell(0));
      }
      this.grid.push(row);
    }
    this.updateSubject.next(this.grid);
  }

  setCell(pos: Pos): void {
    console.log('set cell');
    if (this.grid[pos.i]?.[pos.j]) {
      this.grid[pos.i][pos.j].toggle();
    }
    this.updateSubject.next(this.grid);
  }

  update(): void {
    console.log('update');
    // Count neighbors
    this.grid.forEach((row, i) => row.forEach((cell, j) => {
      let neighbors = 0;
      for (let ni = i - 1; ni <= i + 1; ++ni) {
        for (let nj = j - 1; nj <= j + 1; ++nj) {
          if ((ni !== i || nj !== j) && this.grid[ni]?.[nj]?.value === 1) {
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
    this.updateSubject.next(this.grid);
  }
}
