import {CellState} from '../interfaces/cell-state';

export class Cell {
  private neighbors = 0;
  private livingTime = 0;
  private lastLivingTime = 0;
  private lastEmptyTime = 0;

  constructor(private state = CellState.Empty) {
  }

  isLiving(): boolean {
    return this.state === CellState.Born || this.state === CellState.Living;
  }

  getState(): CellState {
    return this.state;
  }

  // Set state based on living value. If living is null, toggle the cell.
  set(living: boolean = null): void {
    if (living) {
      this.state = CellState.Living;
    } else if (living === false) {
      this.state = CellState.Empty;
    } else {
      this.state = this.isLiving() ? CellState.Empty : CellState.Living;
    }
  }

  setNeighbors(neighbors: number): void {
    this.neighbors = neighbors;
  }

  update(): void {
    if (this.isLiving() && this.neighbors <= 1) {
      this.state = CellState.IsolationDead;
    } else if (this.isLiving() && this.neighbors >= 4) {
      this.state = CellState.OverpopulationDead;
    } else if (this.isLiving()) {
      this.state = CellState.Living;
    } else if (this.neighbors === 3) {
      this.state = CellState.Born;
    } else {
      this.state = CellState.Empty;
    }

    if (this.isLiving()) {
      this.livingTime++;
      this.lastLivingTime++;
      this.lastEmptyTime = 0;
    } else {
      this.lastLivingTime = 0;
      this.lastEmptyTime++;
    }
  }

  resetHistory(): void {
    this.livingTime = this.isLiving() ? 1 : 0;
    this.lastLivingTime = this.livingTime;
    this.lastEmptyTime = this.isLiving() ? 0 : 1;
  }

  getLivingTime(): number {
    return this.livingTime;
  }

  getLastLivingTime(): number {
    return this.lastLivingTime;
  }

  getLastEmptyTime(): number {
    return this.lastEmptyTime;
  }

}
