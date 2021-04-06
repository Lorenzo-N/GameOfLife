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
    if (this.game.time === 0) {
      this.settings.name = 'Vuoto';
      this.game.clear();
    } else {
      this.game.resetInitialGrid();
    }
    this.animationService.endTransition();
  }

  update(): void {
    if (this.animationService.isInTransition()) {
      this.animationService.endTransition();
    } else {
      this.game.update();
    }
  }

}
