import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {GridView} from '../../views/grid-view';
import {GameService} from '../../services/game.service';
import {Pos} from '../../interfaces/pos';

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

  view: GridView;

  constructor(public game: GameService) {
  }

  ngOnInit(): void {
    this.view = new GridView(this.gameLayer, this.gridLayer, this.hoverLayer, this.tooltip, this.game);
    this.view.onClick$.subscribe(pos => this.gridClick.emit(pos));
  }


}
