import {Component} from '@angular/core';
import {Pos} from './interfaces/pos';
import {GameService} from './services/game.service';

@Component({
  selector: 'app-root',
  template: `
    <app-canvas (gridClick)="onGridClick($event)"></app-canvas>
    <app-controls></app-controls>`
})
export class AppComponent {
  constructor(private game: GameService) {
  }

  onGridClick(pos: Pos): void {
    this.game.setCell(pos);
  }
}
