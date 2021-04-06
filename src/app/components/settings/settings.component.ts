import {Component} from '@angular/core';
import {saveAs} from 'file-saver';
import {GameMode} from '../../interfaces/game-mode';
import {examples} from '../../examples/examples';
import {Settings} from '../../models/settings';
import {Game} from '../../models/game';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  readonly GameMode = GameMode;
  readonly examples = examples;

  constructor(private game: Game, public settings: Settings) {
    this.loadExample(examples[0]);
  }

  save(): void {
    saveAs(new Blob([this.game.dumps()], {type: 'application/json'}), 'save.json');
  }

  load(event): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const text = e.target.result;
        if (text) {
          this.settings.name = file.name.replace('.json', '');
          this.game.loads(text);
        }
      };
      fileReader.readAsText(file);
    }
  }

  loadExample(example: { data: string; name: string }): void {
    this.settings.name = example.name;
    this.game.loads(example.data);
  }
}
