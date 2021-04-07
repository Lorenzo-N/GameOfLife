import {CellState} from '../interfaces/cell-state';

export class Cell {
  /**
   * Fa parte del modello Game e gestisce l'aggiornamento di ogni cella della griglia.
   */
  private neighbors = 0;
  private livingTime = 0;
  private lastLivingTime = 0;
  private lastEmptyTime = 0;
  private lastState;

  constructor(private state = CellState.Empty) {
    this.lastState = state;
  }

  isLiving(): boolean {
    return this.state === CellState.Born || this.state === CellState.Living;
  }

  getState(): CellState {
    return this.state;
  }

  getLastState(): CellState {
    return this.lastState;
  }

  wasLiving(): boolean {
    return this.lastState === CellState.Born || this.lastState === CellState.Living;
  }

  set(living: boolean = null): void {
    // Imposta una cella con il valore di living. Se living è null, allora fa il toggle sulla cella.
    if (living) {
      this.state = CellState.Living;
    } else if (living === false) {
      this.state = CellState.Empty;
    } else {
      this.state = this.isLiving() ? CellState.Empty : CellState.Living;
    }
    this.lastState = this.state;
  }

  setNeighbors(neighbors: number): void {
    this.neighbors = neighbors;
  }

  update(): void {
    // Aggiorna lo stato della cella in base alle regole del gioco.
    this.lastState = this.state;
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

    // Aggiorna la storia della cella
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
