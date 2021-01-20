import {Component} from '@angular/core';
import {AnimationService} from '../../services/animation.service';
import {GameService} from '../../services/game.service';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

  constructor(public game: GameService, public animationService: AnimationService, public settings: SettingsService) {
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
