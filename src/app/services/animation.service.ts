import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {Grid} from '../models/grid';

@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  private framesPerUpdate = 10;
  private intervalId: number;
  private framesCounter = 0;

  constructor(private ngZone: NgZone) {
  }

  ngOnDestroy(): void {
    this.stop();
  }

  start(grid: Grid): void {
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => this.nextFrame(grid), 20);
    });
  }

  stop(): void {
    clearInterval(this.intervalId);
  }

  setFramesPerUpdate(frames: number): void {
    this.framesPerUpdate = frames;
  }

  private nextFrame(grid: Grid): void {
    this.framesCounter++;
    if (this.framesCounter >= this.framesPerUpdate) {
      this.framesCounter = 0;
      grid.update();
    }
  }
}
