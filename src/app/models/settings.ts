import {Injectable} from '@angular/core';
import {GameMode} from '../interfaces/game-mode';
import {Subject} from 'rxjs';
import {CellState} from '../interfaces/cell-state';
import {Cell} from './cell';

@Injectable({
  providedIn: 'root'
})
export class Settings {
  /**
   * Modello che gestisce le impostazioni grafiche e di gioco.
   * I modelli non dipendono da niente e vengono quindi implementati come singleton utilizzando la dependency injection di Angular.
   */
  public gameMode = GameMode.Toggle;
  public grid = true;
  public circles = true;
  public colors = true;
  // La modalità smooth (transitions = true) cambia gradualmente il colore di ogni cella invece che passare direttamente da uno stato all'altro
  public transitions = false;
  public framesPerUpdate: number;
  public speed = 50;
  public name = '';
  private transitionsColors = null;
  private readonly statesMap = {
    [CellState.Empty]: {
      name: 'Vuota',
      color: null
    },
    [CellState.IsolationDead]: {
      name: 'Solitudine',
      color: '#fddd7b'
    },
    [CellState.OverpopulationDead]: {
      name: 'Sovrappopolazione',
      color: '#fabf76'
    },
    [CellState.Born]: {
      name: 'Nascita',
      color: '#67e232'
    },
    [CellState.Living]: {
      name: 'In vita',
      color: '#479f21'
    }
  };
  // Espone l'evento onUpdate$ per notificare un aggiornamento del modello.
  // Emette un bool che se true richiede un aggiornamento completo dell'interfaccia.
  private updateSubject = new Subject<boolean>();
  public onUpdate$ = this.updateSubject.asObservable();

  constructor() {
    this.onSpeedUpdate();
  }

  private static interpolateColors(color1: string, color2: string, ratio: number): string {
    // Interpolazione di due colori per la modalità smooth
    const hex = (x: number) => {
      const res = x.toString(16);
      return (res.length === 1) ? '0' + res : res;
    };

    const r = Math.ceil(parseInt(color1.substring(1, 3), 16) * (1 - ratio) + parseInt(color2.substring(1, 3), 16) * ratio);
    const g = Math.ceil(parseInt(color1.substring(3, 5), 16) * (1 - ratio) + parseInt(color2.substring(3, 5), 16) * ratio);
    const b = Math.ceil(parseInt(color1.substring(5, 7), 16) * (1 - ratio) + parseInt(color2.substring(5, 7), 16) * ratio);

    return '#' + hex(r) + hex(g) + hex(b);
  }

  setSpeed(speed: number): void {
    this.speed = speed;
    this.onSpeedUpdate();
  }

  setColors(value: boolean): void {
    this.colors = value;
    this.updateSubject.next(false);
  }

  setGrid(value: boolean): void {
    this.grid = value;
    this.updateSubject.next(true);
  }

  setCircles(value: boolean): void {
    this.circles = value;
    this.updateSubject.next(false);
  }

  setTransitions(value: boolean): void {
    this.transitions = value;
    this.updateSubject.next(false);
  }

  setTransitionsColors(ratio: number, update: boolean): void {
    // Nella modalità smooth calcola una volta per frame i colori da assegnare a ogni possibile transizione considerando
    // l'interpolazione tra i due colori al ratio corrente (che indica l'avanzamento della transizione tra 0 e 1)
    // e salva i colori calcolati in transitionsColors
    this.transitionsColors = {};
    const colors = Object.values(this.statesMap).map(v => v.color ?? '#f9f9f9');
    colors.forEach(color1 => {
      colors.forEach(color2 => {
        if (color1 !== color2) {
          this.transitionsColors[color1 + color2] = Settings.interpolateColors(color1, color2, ratio);
        }
      });
    });
    if (update) {
      this.updateSubject.next(false);
    }
  }

  getCellColor(cell: Cell): string {
    // Ritorna il colore della cella in base ai settings e al suo stato
    const state = this.colors ? cell.getState() : (cell.isLiving() ? CellState.Living : CellState.Empty);
    const lastState = this.colors ? cell.getLastState() : (cell.wasLiving() ? CellState.Living : CellState.Empty);
    // Se è abilitata la modalità smooth riprende il colore della cella da transitionsColors. In questo modo non viene fatta
    // l'interpolazione ogni frame per ogni cella ma solo una volta per frame migliorando le performance.
    if (state !== lastState && this.transitions) {
      return this.transitionsColors[(this.statesMap[lastState].color ?? '#f9f9f9') +
      (this.statesMap[state].color ?? '#f9f9f9')];
    }
    return this.statesMap[state].color;
  }

  getCellName(cell: Cell): string {
    return this.statesMap[cell.getState()].name;
  }

  private onSpeedUpdate(): void {
    // Converte la velocità [0, 100] in frames per update [70, 1]
    this.framesPerUpdate = Math.round(70 - Math.log(1 + this.speed) * 15);
  }
}
