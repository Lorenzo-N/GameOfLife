import {Injectable} from '@angular/core';
import {GameMode} from '../interfaces/game-mode';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public gameMode = GameMode.Toggle;
  public colors = true;
  public framesPerUpdate: number;
  public speed = 90;

  constructor() {
    this.onSpeedUpdate();
  }

  setSpeed(speed: number): void {
    this.speed = speed;
    this.onSpeedUpdate();
  }

  private onSpeedUpdate(): void {
    // Map speed [0, 100] to frames per update [51, 1]
    this.framesPerUpdate = 51 - Math.ceil(this.speed / 2);
  }
}
