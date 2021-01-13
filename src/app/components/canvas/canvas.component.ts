import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Grid} from '../../models/grid';
import {GridView} from '../../views/grid-view';

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

    console.log(this.grid);
  }

  onClick(component): void {
    console.log('Click', component);
    this.grid.update();
  }
}
