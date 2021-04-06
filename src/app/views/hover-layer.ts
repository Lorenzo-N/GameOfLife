import {Pos} from '../interfaces/pos';
import {Game} from '../models/game';
import {ElementRef} from '@angular/core';
import {GameMode} from '../interfaces/game-mode';
import {GridInfo} from '../interfaces/grid-info';
import {Settings} from '../models/settings';

export class HoverLayer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly tooltip: HTMLDivElement;
  private tooltipPos: Pos = null;

  constructor(canvas: ElementRef<HTMLCanvasElement>, tooltip: ElementRef<HTMLDivElement>, private gridInfo: GridInfo,
              private game: Game, private settings: Settings) {
    this.ctx = canvas?.nativeElement?.getContext('2d');
    if (!this.ctx) {
      throw new Error('Canvas initialization error');
    }
    this.tooltip = tooltip.nativeElement;
  }

  draw(updateSize: boolean, pos?: Pos): void {
    if (updateSize) {
      this.ctx.canvas.width = this.gridInfo.canvasWidth;
      this.ctx.canvas.height = this.gridInfo.canvasHeight;
    }
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (pos) {
      this.ctx.fillStyle = '#00000033';
      if (this.settings.circles) {
        this.ctx.beginPath();
        this.ctx.arc(this.gridInfo.x + pos.i * this.gridInfo.cellSize + this.gridInfo.cellSize / 2,
          this.gridInfo.y + pos.j * this.gridInfo.cellSize + this.gridInfo.cellSize / 2, this.gridInfo.cellSize / 2 - 1, 0, 2 * Math.PI);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(this.gridInfo.x + pos.i * this.gridInfo.cellSize, this.gridInfo.y + pos.j * this.gridInfo.cellSize,
          this.gridInfo.cellSize, this.gridInfo.cellSize);
      }

      if (this.settings.gameMode === GameMode.Details) {
        this.refreshTooltip(pos);
      }
    } else {
      this.hideTooltip();
    }
  }

  refreshTooltip(pos?: Pos): void {
    if (pos) {
      this.tooltipPos = pos;
      this.tooltip.style.visibility = 'visible';
      this.tooltip.style.left = (this.gridInfo.x + pos.i * this.gridInfo.cellSize - 79) + 'px';
      this.tooltip.style.top = (this.gridInfo.y + pos.j * this.gridInfo.cellSize - 85) + 'px';
    }
    if (pos || this.tooltipPos) {
      this.setTooltipContent(pos ?? this.tooltipPos);
    }
  }

  private hideTooltip(): void {
    this.tooltip.style.visibility = 'hidden';
    this.tooltipPos = null;
  }

  private setTooltipContent(pos: Pos): void {
    const cell = this.game.getCell(pos);
    if (cell) {
      const lastLiving = `<div><span class="info">In vita da:</span><span class="value">${cell.getLastLivingTime()}</span></div>`;
      const lastEmpty = `<div><span class="info">Vuota da:</span><span class="value">${cell.getLastEmptyTime()}</span></div>`;
      this.tooltip.innerHTML = `
            <div><span class="info">Stato:</span><span class="value">${this.settings.getCellName(cell)}</span></div>
            ${cell.isLiving() ? lastLiving : lastEmpty}
            <div><span class="info">Tempo tot vita:</span><span class="value">${cell.getLivingTime()}</span></div>`;
    }
  }
}
