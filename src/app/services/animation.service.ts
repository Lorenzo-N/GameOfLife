import {Injectable, OnDestroy} from '@angular/core';
import {Settings} from '../models/settings';
import {Game} from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  /**
   * Servizio che gestisce l'animazione e le transizioni.
   */
  public isRunning = false;
  private intervalId: number;
  private time = 0;
  private transitionTime = 0.5;

  constructor(private game: Game, private settings: Settings) {
  }


  ngOnDestroy(): void {
    this.stop();
  }

  start(): void {
    // Ogni 20 ms esegue un frame.
    this.intervalId = setInterval(() => this.nextFrame(), 20);
    this.isRunning = true;
  }

  stop(): void {
    clearInterval(this.intervalId);
    this.isRunning = false;
  }

  endTransition(): void {
    this.time = 0;
    this.settings.setTransitionsColors(1, true);
  }

  isInTransition(): boolean {
    // True se è abilitata la modalità smooth e è nel mezzo di una transizione
    return this.settings.transitions && this.time !== 0 && this.time <= this.transitionTime;
  }

  private nextFrame(): void {
    // Ogni frame avanza il tempo di una frazione. Quando sono passati framesPerUpdate frame allora esegue uno step del gioco.
    // Modificando framesPerUpdate si modifica quindi la velocità del gioco pur mantenendo gli stessi frame al secondo, utili
    // per l'animazione nella modalità smooth.
    this.time += 1 / this.settings.framesPerUpdate;
    if (this.time >= 1) {
      // Effettua un aggiornamento del gioco
      this.time = 0;
      this.settings.setTransitionsColors(0, false);
      this.game.update();
    } else if (this.isInTransition()) {
      // Modifica solo l'avanzamento della transizione nella modalità smooth ma non cambia lo stato del gioco
      this.settings.setTransitionsColors(this.time / this.transitionTime, true);
    }
  }
}
