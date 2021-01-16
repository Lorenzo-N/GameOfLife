import {Injectable, OnDestroy} from '@angular/core';
import {GameService} from './game.service';

@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  public isRunning = false;
  private framesPerUpdate = 10;
  private intervalId: number;
  private framesCounter = 0;

  constructor(private game: GameService) {
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
