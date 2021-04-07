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
  /**
   * Definisce tutti i controlli e le impostazioni sulla sinistra dell'interfaccia.
   * Negli eventi dell'html data la semplicità vengono direttamente chiamati i metodi per modificare il modello Settings.
   * Inoltre gestisce il load e il save del modello Game su file.
   */
  readonly GameMode = GameMode;
  readonly examples = examples;

  constructor(private game: Game, public settings: Settings) {
    // Carica il primo esempio all'avvio dell'app
    this.loadExample(examples[0]);
  }

  save(): void {
    // Salva il modello Game come json
    saveAs(new Blob([this.game.dumps()], {type: 'application/json'}), 'save.json');
  }

  load(event): void {
    // Carica il modello Game da json
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
    // Carica il modello Game da uno degli esempi disponibili
    this.settings.name = example.name;
    this.game.loads(example.data);
  }
}
