import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {GameService} from './game.service';

@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  private framesPerUpdate = 10;
  private intervalId: number;
  private framesCounter = 0;

  constructor(private game: GameService, private ngZone: NgZone) {
  }

  ngOnDestroy(): void {
    this.stop();
  }

  start(): void {
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => this.nextFrame(), 20);
    });
  }

  stop(): void {
    clearInterval(this.intervalId);
  }

  setFramesPerUpdate(frames: number): void {
    this.framesPerUpdate = frames;
  }

  private nextFrame(): void {
    this.framesCounter++;
    if (this.framesCounter >= this.framesPerUpdate) {
      this.framesCounter = 0;
      this.game.update();
    }
  }
}
