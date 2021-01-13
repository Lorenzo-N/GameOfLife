import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {Grid} from '../models/grid';

@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  public framesPerUpdate = 10;
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

  private nextFrame(grid: Grid): void {
    this.framesCounter = (this.framesCounter + 1) % this.framesPerUpdate;
    if (this.framesCounter === 0) {
      grid.update();
    }
    this.requestId = requestAnimationFrame(() => this.nextFrame(grid));
  }
}
