import {Injectable, OnDestroy} from '@angular/core';
import {GameService} from './game.service';
import {SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  public isRunning = false;
  private intervalId: number;
  private framesCounter = 0;

  constructor(private game: GameService, private settings: SettingsService) {
  }

  ngOnDestroy(): void {
    this.stop();
  }

  start(): void {
    this.intervalId = setInterval(() => this.nextFrame(), 20);
    this.isRunning = true;
  }

  stop(): void {
    clearInterval(this.intervalId);
    this.isRunning = false;
  }

  private nextFrame(): void {
    this.framesCounter++;
    if (this.framesCounter >= this.settings.framesPerUpdate) {
      this.framesCounter = 0;
      this.game.update();
    }
  }
}
