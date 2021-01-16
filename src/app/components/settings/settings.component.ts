import {Component} from '@angular/core';
import {GameService} from '../../services/game.service';
import {saveAs} from 'file-saver';
import {GameMode} from '../../interfaces/game-mode';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  readonly GameMode = GameMode;

  constructor(private game: GameService, public settings: SettingsService) {
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
