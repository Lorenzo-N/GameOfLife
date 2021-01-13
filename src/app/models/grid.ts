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
        row.push(new Cell((i + j) % 2));
      }
      this.grid.push(row);
    }
    this.updateSubject.next(this.grid);
  }

  setCell(pos: Pos): void {
    console.log('set cell');
    if (this.grid[pos.x]?.[pos.y]) {
      this.grid[pos.x][pos.y].toggle();
    }
    this.updateSubject.next(this.grid);
  }

  update(): void {
    console.log('update');
    this.updateSubject.next(this.grid);
  }
}
