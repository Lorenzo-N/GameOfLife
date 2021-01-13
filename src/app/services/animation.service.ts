import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {Grid} from '../models/grid';

@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  private requestId: number;

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
    grid.update();
    this.requestId = requestAnimationFrame(() => this.nextFrame(grid));
  }
}
