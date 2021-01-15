import {CellState} from '../interfaces/cell-state';

export class Cell {
  private neighbors = 0;
  private livingTime = 0;

  constructor(private state = CellState.Empty) {
  }

  isLiving(): boolean {
    return this.state === CellState.Born || this.state === CellState.Living;
  }

  getState(): CellState {
    return this.state;
  }

  toggle(): void {
    this.state = this.isLiving() ? CellState.Empty : CellState.Living;
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
    }
  }

  resetHistory(): void {
    this.livingTime = this.isLiving() ? 1 : 0;
  }

  getLivingTime(): number {
    return this.livingTime;
  }

}
