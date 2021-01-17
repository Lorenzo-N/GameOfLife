import {Pos} from '../interfaces/pos';
import {Game} from '../models/game';
import {ElementRef} from '@angular/core';
import {Subject} from 'rxjs';
import {SettingsService} from '../services/settings.service';
import {GameMode} from '../interfaces/game-mode';
import {HoverLayer} from './hover-layer';
import {GridInfo} from '../interfaces/grid-info';
import {GridLayer} from './grid-layer';
import {GameLayer} from './game-layer';

export class GameView {
  private readonly gameLayer: GameLayer;
  private readonly gridLayer: GridLayer;
  private readonly hoverLayer: HoverLayer;
  private requestId: number;
  private fullRefresh: boolean;
  private clickSubject = new Subject<Pos>();
  public onClick$ = this.clickSubject.asObservable();
  private gridInfo: GridInfo = {
    cellSize: 15, canvasHeight: 0, canvasWidth: 0, height: 0, width: 0, x: 0, y: 0
  };

  constructor(gameLayer: ElementRef<HTMLCanvasElement>, gridLayer: ElementRef<HTMLCanvasElement>,
              hoverLayer: ElementRef<HTMLCanvasElement>, tooltip: ElementRef<HTMLDivElement>,
              private game: Game, private settings: SettingsService) {
    this.gameLayer = new GameLayer(gameLayer, this.gridInfo, game, settings);
    this.gridLayer = new GridLayer(gridLayer, this.gridInfo, game, settings);
    this.hoverLayer = new HoverLayer(hoverLayer, tooltip, this.gridInfo, game, settings);
    this.refresh(true);
    game.onUpdate$.subscribe(() => this.refresh(false));
    settings.onUpdate$.subscribe(() => this.refresh(true));
  }

  onClick(event: MouseEvent): void {
    const pos = this.mouseEventToPos(event);
    if (pos) {
      this.clickSubject.next(pos);
    }
  }

  onMouseMove(event: MouseEvent): void {
    const pos = this.mouseEventToPos(event);
    if (pos && (event.buttons % 2) === 1 && (this.settings.gameMode === GameMode.Edit || this.settings.gameMode === GameMode.Erase)) {
      this.clickSubject.next(pos);
    }
    this.hoverLayer.draw(false, pos);
  }

  onMouseLeave(): void {
    this.hoverLayer.draw(false);
  }

  refresh(fullRefresh: boolean): void {
    if (fullRefresh) {
      this.fullRefresh = true;
    }
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(() => {
        this.requestId = null;
        if (this.fullRefresh) {
          this.fullRefresh = false;
          this.updateGridInfo();
          this.gridLayer.draw(true);
          this.hoverLayer.draw(true);
          this.gameLayer.draw(true);
        } else {
          this.gameLayer.draw(false);
        }
      });
    }
    this.hoverLayer.refreshTooltip();
  }

  private updateGridInfo(): void {
    const width = this.gameLayer.getCanvas().parentElement.clientWidth;
    const height = this.gameLayer.getCanvas().parentElement.clientHeight;
    this.gridInfo.canvasWidth = width;
    this.gridInfo.canvasHeight = height;
    this.gridInfo.width = Math.min(width, this.gridInfo.cellSize * this.game.getWidth());
    this.gridInfo.height = Math.min(height, this.gridInfo.cellSize * this.game.getHeight());
  }

  private mouseEventToPos(event: MouseEvent): Pos {
    const rect = this.gameLayer.getCanvas().getBoundingClientRect();
    const pos = {
      i: Math.floor((event.clientX - rect.left) / this.gridInfo.cellSize),
      j: Math.floor((event.clientY - rect.top) / this.gridInfo.cellSize)
    };
    return (pos.i >= 0 && pos.j >= 0 && pos.i * this.gridInfo.cellSize < this.gridInfo.width &&
      pos.j * this.gridInfo.cellSize < this.gridInfo.height) ? pos : null;
  }
}
