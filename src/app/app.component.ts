import {Component, HostBinding} from '@angular/core';
import {Pos} from './interfaces/pos';
import {GameService} from './services/game.service';
import {SettingsService} from './services/settings.service';
import {GameMode} from './interfaces/game-mode';

@Component({
  selector: 'app-root',
  template: `
    <app-settings class="bg-surface padding col overflow-y-auto"></app-settings>
    <div class="col flex">
      <div class="row center margin-s">
        <img src="assets/logo.png" alt="logo" height="50px">
      </div>
      <app-canvas (gridClick)="onGridClick($event)" class="col flex overflow-hidden"></app-canvas>
      <app-controls class="row border-top bg-surface padding center-x"></app-controls>
    </div>
  `
})
export class AppComponent {
  @HostBinding('class') class = 'row flex';

  constructor(private game: GameService, private settings: SettingsService) {
  }

  onGridClick(pos: Pos): void {
    this.settings.name = 'Schema manuale';
    if (this.settings.gameMode === GameMode.Toggle || this.settings.gameMode === GameMode.Details) {
      this.game.setCell(pos);
    } else {
      this.game.setCell(pos, this.settings.gameMode === GameMode.Edit);
    }
  }
}
