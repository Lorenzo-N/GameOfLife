import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Grid} from '../../models/grid';
import {GridView} from '../../views/grid-view';
import {Pos} from '../../models/pos';
import {AnimationService} from '../../services/animation.service';

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

  constructor(private animationService: AnimationService) {
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

  start(): void {
    this.animationService.start(this.grid);
  }

  pause(): void {
    this.animationService.pause();
  }

  clear(): void {
    this.grid.clear();
  }

  update(): void {
    this.grid.update();
  }

}
