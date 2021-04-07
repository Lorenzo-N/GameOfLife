import {Component, HostBinding} from '@angular/core';
import {Pos} from './interfaces/pos';
import {GameMode} from './interfaces/game-mode';
import {Settings} from './models/settings';
import {Game} from './models/game';

@Component({
  selector: 'app-root',
  template: `
    <app-settings class="bg-surface padding col overflow-y-auto"></app-settings>
    <div class="col flex">
      <div class="row center margin">
        <img src="assets/logo.png" alt="logo" height="50px">
      </div>
      <app-canvas (gridClick)="onGridClick($event)" class="col flex overflow-hidden"></app-canvas>
      <app-controls class="row border-top bg-surface padding center-x"></app-controls>
    </div>
  `
})
export class AppComponent {
  /**
   * Componente principale: gestisce l'evento di click sulla vista andando a modificare il modello Game.
   */
  @HostBinding('class') class = 'row flex';

  constructor(private game: Game, private settings: Settings) {
  }

  onGridClick(pos: Pos): void {
    this.settings.name = 'Schema manuale';
    // Modifica una cella in base alla modalità selezionata
    if (this.settings.gameMode === GameMode.Toggle || this.settings.gameMode === GameMode.Details) {
      this.game.setCell(pos);
    } else {
      this.game.setCell(pos, this.settings.gameMode === GameMode.Edit);
    }
  }
}
