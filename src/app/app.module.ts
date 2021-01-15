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
import {faPlay} from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ControlsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSliderModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary, faConfig: FaConfig) {
    library.addIcons(faPlay);
    faConfig.fixedWidth = true;
  }
}
