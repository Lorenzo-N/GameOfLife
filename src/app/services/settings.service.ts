import {Injectable} from '@angular/core';
import {GameMode} from '../interfaces/game-mode';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public gameMode = GameMode.Toggle;
  public colors = true;
  public framesPerUpdate: number;
  public speed = 50;
  private updateSubject = new Subject();
  public onUpdate$ = this.updateSubject.asObservable();

  constructor() {
    this.onSpeedUpdate();
  }

  setSpeed(speed: number): void {
    this.speed = speed;
    this.onSpeedUpdate();
  }

  setColors(colors: boolean): void {
    this.colors = colors;
    this.updateSubject.next();
  }

  private onSpeedUpdate(): void {
    // Map speed [0, 100] to frames per update [70, 1]
    this.framesPerUpdate = Math.round(70 - Math.log(1 + this.speed) * 15);
  }
}
