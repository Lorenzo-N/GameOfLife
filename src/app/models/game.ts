import {BehaviorSubject} from 'rxjs';
import {Pos} from '../interfaces/pos';
import {Cell} from './cell';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Game {
  /**
   * Modello principale che gestisce la griglia e le logiche di gioco.
   * I modelli non dipendono da niente e vengono quindi implementati come singleton utilizzando la dependency injection di Angular.
   */
  public time = 0;
  public lastPopulation = 0;
  public population = 0;
  private initialGridDump: string;
  private grid: Cell[][] = [];
  private width = 100;
  private height = 50;
  // Espone l'evento onUpdate$ per notificare un aggiornamento del modello.
  private updateSubject = new BehaviorSubject<Cell[][]>(null);
  public onUpdate$ = this.updateSubject.asObservable();

  constructor() {
    this.clear();
  }

  setCell(pos: Pos, living: boolean = null): void {
    // Imposta una cella con il valore di living. Se living è null, allora fa il toggle sulla cella.
    if (this.grid[pos.i]?.[pos.j]) {
      this.grid[pos.i][pos.j].set(living);
    }
    // Resetta la storia essendo stato modificato manualmente lo stato.
    this.resetHistory();
    // Emette l'evento di update
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
    // Conta i vicini di ogni cella
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
    // Aggiorna gli stati delle celle e le informazioni globali. Avendo salvato per ogni cella il numero dei
    // vicini l'aggiornamento è simultaneo per tutte le celle.
    this.lastPopulation = this.population;
    this.population = 0;
    this.grid.forEach(row => row.forEach(cell => {
      cell.update();
      if (cell.isLiving()) {
        this.population++;
      }
    }));
    this.time++;
    // Emette l'evento di update
    this.updateSubject.next(this.grid);
  }

  clear(): void {
    // Resetta la griglia svuotandola
    this.grid = [];
    for (let i = 0; i < this.width; ++i) {
      const row: Cell[] = [];
      for (let j = 0; j < this.height; ++j) {
        row.push(new Cell());
      }
      this.grid.push(row);
    }
    // Resetta la storia e emette l'evento di update
    this.resetHistory();
    this.updateSubject.next(this.grid);
  }

  dumps(): string {
    // Salva le informazioni sullo stato del gioco in un json
    return JSON.stringify({
      width: this.width,
      height: this.height,
      grid: this.grid.map(row => row.map(cell => cell.getState()))
    });
  }

  loads(data: string): void {
    // Carica le informazioni sullo stato del gioco da un json, resettando la storia e emettendo l'evento di update
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
    // Ripristina lo stato iniziale salvato.
    this.loads(this.initialGridDump);
  }

  private resetHistory(): void {
    // Resetta la storia e aggiorna le informazioni globali
    this.time = 0;
    this.population = 0;
    this.grid.forEach(row => row.forEach(cell => {
      cell.resetHistory();
      if (cell.isLiving()) {
        this.population++;
      }
    }));
    this.lastPopulation = this.population;
    // Salva il json dello stato corrente per poterlo ripristinare in futuro.
    this.initialGridDump = this.dumps();
  }
}
