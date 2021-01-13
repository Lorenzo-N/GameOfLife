import {BehaviorSubject} from 'rxjs';

export class Grid {
  private readonly grid: number[][] = [];
  private updateSubject = new BehaviorSubject<number[][]>(null);
  public onUpdate$ = this.updateSubject.asObservable();

  constructor(private size = 50) {
    for (let i = 0; i < this.size; ++i) {
      const row: number[] = [];
      for (let j = 0; j < this.size; ++j) {
        row.push((i + j) % 2);
      }
      this.grid.push(row);
    }
    this.updateSubject.next(this.grid);
  }

  update(): void {
    console.log('update');
    this.updateSubject.next(this.grid);
  }
}
