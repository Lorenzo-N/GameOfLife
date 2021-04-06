import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import {GameView} from '../../views/game-view';
import {Pos} from '../../interfaces/pos';
import {GameMode} from '../../interfaces/game-mode';
import {Settings} from '../../models/settings';
import {Game} from '../../models/game';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @Output() gridClick = new EventEmitter<Pos>();

  @ViewChild('gameLayer', {static: true})
  gameLayer: ElementRef<HTMLCanvasElement>;
  @ViewChild('gridLayer', {static: true})
  gridLayer: ElementRef<HTMLCanvasElement>;
  @ViewChild('hoverLayer', {static: true})
  hoverLayer: ElementRef<HTMLCanvasElement>;
  @ViewChild('tooltip', {static: true})
  tooltip: ElementRef<HTMLDivElement>;

  view: GameView;
  cursor = {
    [GameMode.Toggle]: 'pointer',
    [GameMode.Details]: 'pointer',
    [GameMode.Edit]: 'copy',
    [GameMode.Erase]: 'default'
  };

  constructor(private game: Game, public settings: Settings) {
  }

  ngOnInit(): void {
    this.view = new GameView(this.gameLayer, this.gridLayer, this.hoverLayer, this.tooltip, this.game, this.settings);
    this.view.onClick$.subscribe(pos => this.gridClick.emit(pos));
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.view.refresh(true);
  }
}
