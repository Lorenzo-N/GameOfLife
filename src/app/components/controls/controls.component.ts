import {Component} from '@angular/core';
import {AnimationService} from '../../services/animation.service';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

  constructor(public game: GameService, public animationService: AnimationService) {
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
      this.game.clear();
    } else {
      this.game.resetInitialGrid();
    }
  }

  update(): void {
    this.game.update();
  }

}
