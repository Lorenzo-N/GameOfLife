import {Component, OnInit} from '@angular/core';
import {GameService} from '../../services/game.service';
import {AnimationService} from '../../services/animation.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  readonly defaultSpeed = 90;

  constructor(private game: GameService, private animationService: AnimationService) {
  }

  ngOnInit(): void {
    this.onSpeedChange(this.defaultSpeed);
  }

  onSpeedChange(speed: number): void {
    // Map speed [0, 100] to frames per update [51, 1]
    this.animationService.setFramesPerUpdate(51 - Math.ceil(speed / 2));
  }

  save(): void {
    saveAs(new Blob([this.game.dumps()], {type: 'application/json'}), 'save.json');
  }

  load(event): void {
    if (event.target.files && event.target.files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const text = e.target.result;
        if (text) {
          this.game.loads(text);
        }
      };
      fileReader.readAsText(event.target.files[0]);
    }
  }
}
