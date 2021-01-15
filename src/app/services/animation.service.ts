import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {Grid} from '../models/grid';

@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  private framesPerUpdate = 10;
  private requestId: number;
  private framesCounter = 0;

  constructor(private ngZone: NgZone) {
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.requestId);
  }

  start(grid: Grid): void {
    this.ngZone.runOutsideAngular(() => this.nextFrame(grid));
  }

  pause(): void {
    cancelAnimationFrame(this.requestId);
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
    this.requestId = requestAnimationFrame(() => this.nextFrame(grid));
  }
}
