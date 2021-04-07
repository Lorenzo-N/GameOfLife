import {Pos} from '../interfaces/pos';
import {Game} from '../models/game';
import {ElementRef} from '@angular/core';
import {Subject} from 'rxjs';
import {GameMode} from '../interfaces/game-mode';
import {HoverLayer} from './hover-layer';
import {GridInfo} from '../interfaces/grid-info';
import {GridLayer} from './grid-layer';
import {GameLayer} from './game-layer';
import {Settings} from '../models/settings';

export class GameView {
  /**
   * Vista principale che gestisce i vari layer. Sono stati creati più canvas come layer sovrapposti in modo
   * da ridisegnare ogni volta solo i layer necessari migliorando le performance.
   */
  private readonly gameLayer: GameLayer;
  private readonly gridLayer: GridLayer;
  private readonly hoverLayer: HoverLayer;
  private requestId: number;
  private fullRefresh: boolean;
  // Espone l'evento di click sulla griglia passando la posizione della cella cliccata
  private clickSubject = new Subject<Pos>();
  public onClick$ = this.clickSubject.asObservable();
  private gridInfo: GridInfo = {
    cellSize: 15, canvasHeight: 0, canvasWidth: 0, height: 0, width: 0, x: 0, y: 0
  };

  constructor(gameLayer: ElementRef<HTMLCanvasElement>, gridLayer: ElementRef<HTMLCanvasElement>,
              hoverLayer: ElementRef<HTMLCanvasElement>, tooltip: ElementRef<HTMLDivElement>,
              private game: Game, private settings: Settings) {
    // Associa le viste dei layer ai relativi canvas
    this.gameLayer = new GameLayer(gameLayer, this.gridInfo, game, settings);
    this.gridLayer = new GridLayer(gridLayer, this.gridInfo, game, settings);
    this.hoverLayer = new HoverLayer(hoverLayer, tooltip, this.gridInfo, game, settings);
    // Esegue un refresh iniziale
    this.refresh(true);
    // Si aggancia agli eventi update dei modelli Game e Settings ridisegnando la vista di conseguenza
    game.onUpdate$.subscribe(() => this.refresh(false));
    settings.onUpdate$.subscribe(fullRefresh => this.refresh(fullRefresh));
  }

  onClick(event: MouseEvent): void {
    // Evento di click nativo dell'html che viene mappato in una posizione della cella cliccata emettendo poi l'evento
    const pos = this.mouseEventToPos(event);
    if (pos) {
      this.clickSubject.next(pos);
    }
  }

  onMouseMove(event: MouseEvent): void {
    // Evento nativo di mousemove
    const pos = this.mouseEventToPos(event);
    // Se si è nella modalità penna o gomma e di sta trascinando emette l'evento di click sulla cella corrente
    if (pos && (event.buttons % 2) === 1 && (this.settings.gameMode === GameMode.Edit || this.settings.gameMode === GameMode.Erase)) {
      this.clickSubject.next(pos);
    }
    // In ogni caso aggiorna il layer di over sulla posizione corrente
    this.hoverLayer.draw(false, pos);
  }

  onMouseLeave(): void {
    this.hoverLayer.draw(false);
  }

  refresh(fullRefresh: boolean): void {
    // Effettua un refresh della vista
    if (fullRefresh) {
      this.fullRefresh = true;
    }
    // this.requestId serve a garantire che non vengano chiamati più requestAnimationFrame
    // simultanei anche in caso di più chiamate a questo metodo
    if (!this.requestId) {
      // Richiede un animation frame del javascript in modo asincrono
      this.requestId = requestAnimationFrame(() => {
        this.requestId = null;
        if (this.fullRefresh) {
          // Effettua un refresh di tutti i layer e delle dimensioni della griglia
          this.fullRefresh = false;
          this.updateGridInfo();
          this.gridLayer.draw(true);
          this.hoverLayer.draw(true);
          this.gameLayer.draw(true);
        } else {
          // Ridisegna solo il layer di gioco. In questo modo durante l'animazione quando non vengono cambiate le impostazioni
          // si ridisegna solo il layer necessario migliorando le performance
          this.gameLayer.draw(false);
        }
      });
    }
    // In ogni caso aggiorna il tooltip se presente
    this.hoverLayer.refreshTooltip();
  }

  private updateGridInfo(): void {
    // Ricalcola le dimensioni delle celle e della griglia in base allo spazio disponibile
    const width = this.gameLayer.getCanvas().parentElement.clientWidth;
    const height = this.gameLayer.getCanvas().parentElement.clientHeight;
    const info = this.gridInfo;
    info.canvasWidth = width;
    info.canvasHeight = height;
    info.cellSize = Math.floor(Math.min(width / this.game.getWidth(), height / this.game.getHeight()));
    info.width = Math.min(width, info.cellSize * this.game.getWidth());
    info.height = Math.min(height, info.cellSize * this.game.getHeight());
    info.x = (width - info.width) / 2;
    info.y = (height - info.height) / 2;
  }

  private mouseEventToPos(event: MouseEvent): Pos {
    // Converte una posizione in px nella posizione i, j della cella corrispondente, o null se è fuori dalla griglia
    const rect = this.gameLayer.getCanvas().getBoundingClientRect();
    const pos = {
      i: Math.floor((event.clientX - rect.left - this.gridInfo.x) / this.gridInfo.cellSize),
      j: Math.floor((event.clientY - rect.top - this.gridInfo.y) / this.gridInfo.cellSize)
    };
    return (pos.i >= 0 && pos.j >= 0 && pos.i < this.game.getWidth() && pos.j < this.game.getHeight()) ? pos : null;
  }
}
