import {Injectable} from '@angular/core';
import {GameMode} from '../interfaces/game-mode';
import {Subject} from 'rxjs';
import {CellState} from '../interfaces/cell-state';
import {Cell} from '../models/cell';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public gameMode = GameMode.Toggle;
  public grid = true;
  public colors = true;
  public framesPerUpdate: number;
  public speed = 50;
  public name = '';
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
  private updateSubject = new Subject();
  public onUpdate$ = this.updateSubject.asObservable();

  constructor() {
    this.onSpeedUpdate();
  }

  setSpeed(speed: number): void {
    this.speed = speed;
    this.onSpeedUpdate();
  }

  setColors(value: boolean): void {
    this.colors = value;
    this.updateSubject.next();
  }

  setGrid(value: boolean): void {
    this.grid = value;
    this.updateSubject.next();
  }

  getCellColor(cell: Cell): string {
    const state = this.colors ? cell.getState() : (cell.isLiving() ? CellState.Living : CellState.Empty);
    return this.statesMap[state].color;
  }

  getCellName(cell: Cell): string {
    return this.statesMap[cell.getState()].name;
  }

  private onSpeedUpdate(): void {
    // Map speed [0, 100] to frames per update [70, 1]
    this.framesPerUpdate = Math.round(70 - Math.log(1 + this.speed) * 15);
  }
}
