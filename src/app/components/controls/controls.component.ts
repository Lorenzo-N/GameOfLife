import {Component} from '@angular/core';
import {AnimationService} from '../../services/animation.service';
import {Settings} from '../../models/settings';
import {Game} from '../../models/game';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {
  /**
   * Componente dei controlli del gioco. Questo controller si aggancia agli eventi dell'html associato per
   * modificare il Game e l'animazione.
   */

  constructor(public game: Game, public animationService: AnimationService, public settings: Settings) {
  }

  toggleAnimation(): void {
    if (this.animationService.isRunning) {
      this.animationService.stop();
    } else {
      this.animationService.start();
    }
  }

  reset(): void {
    // Al primo reset riporta il gioco nello stato di partenza, al secondo cancella la griglia
    if (this.game.time === 0) {
      this.settings.name = 'Vuoto';
      this.game.clear();
    } else {
      this.game.resetInitialGrid();
    }
    this.animationService.endTransition();
  }

  update(): void {
    // Procede di uno step nel gioco
    if (this.animationService.isInTransition()) {
      this.animationService.endTransition();
    } else {
      this.game.update();
    }
  }

}
