import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CanvasComponent} from './components/canvas/canvas.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';
import {ControlsComponent} from './components/controls/controls.component';
import {FaConfig, FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faArchive,
  faBorderAll,
  faCaretDown,
  faChess,
  faCogs,
  faCrosshairs,
  faEraser,
  faFileUpload,
  faGamepad,
  faGem,
  faHandPointer,
  faPalette,
  faPause,
  faPen,
  faPlay,
  faPlayCircle,
  faSave,
  faSearch,
  faStepForward,
  faTachometerAlt,
  faTimes,
  faUndoAlt
} from '@fortawesome/free-solid-svg-icons';
import {SettingsComponent} from './components/settings/settings.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {faHubspot} from '@fortawesome/free-brands-svg-icons';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ControlsComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary, faConfig: FaConfig) {
    library.addIcons(faPlay, faPause, faStepForward, faUndoAlt, faTimes, faPen, faEraser, faCrosshairs, faGamepad, faCogs, faBorderAll,
      faSearch, faHandPointer, faSave, faFileUpload, faArchive, faTachometerAlt, faPalette, faChess, faGem, faHubspot, faCaretDown,
      faPlayCircle);
    faConfig.fixedWidth = true;
  }
}
