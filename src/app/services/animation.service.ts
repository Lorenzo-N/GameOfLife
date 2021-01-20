import {Injectable, OnDestroy} from '@angular/core';
import {GameService} from './game.service';
import {SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  public isRunning = false;
  private intervalId: number;
  private time = 0;
  private transitionTime = 0.5;

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

  endTransition(): void {
    this.time = 0;
    this.settings.setTransitionsColors(1, true);
  }

  isInTransition(): boolean {
    return this.settings.transitions && this.time !== 0 && this.time <= this.transitionTime;
  }

  private nextFrame(): void {
    this.time += 1 / this.settings.framesPerUpdate;
    if (this.time >= 1) {
      this.time = 0;
      this.settings.setTransitionsColors(0, false);
      this.game.update();
    } else if (this.isInTransition()) {
      this.settings.setTransitionsColors(this.time / this.transitionTime, true);
    }
  }
}
