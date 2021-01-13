import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Grid} from '../../models/grid';
import {GridView} from '../../views/grid-view';
import {Pos} from '../../models/pos';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  grid: Grid;
  gridView: GridView;

  constructor() {
  }

  ngOnInit(): void {
    this.grid = new Grid();
    this.gridView = new GridView(this.canvas, this.grid);
    this.gridView.onClick$.subscribe(pos => this.onGridClick(pos));
    console.log(this.grid);
  }

  onGridClick(pos: Pos): void {
    console.log('Click', pos);
    this.grid.setCell(pos);
  }

  update(): void {
    this.grid.update();
  }
}
