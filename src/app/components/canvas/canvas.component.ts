import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Grid} from '../../models/grid';
import {GridView} from '../../views/grid-view';
import {Pos} from '../../models/pos';
import {AnimationService} from '../../services/animation.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('gameLayer', {static: true})
  gameLayer: ElementRef<HTMLCanvasElement>;
  @ViewChild('gridLayer', {static: true})
  gridLayer: ElementRef<HTMLCanvasElement>;
  @ViewChild('hoverLayer', {static: true})
  hoverLayer: ElementRef<HTMLCanvasElement>;
  @ViewChild('tooltip', {static: true})
  tooltip: ElementRef<HTMLDivElement>;

  grid: Grid;
  gridView: GridView;
  readonly defaultSpeed = 50;

  constructor(private animationService: AnimationService) {
  }

  ngOnInit(): void {
    this.grid = new Grid();
    this.gridView = new GridView(this.gameLayer, this.gridLayer, this.hoverLayer, this.tooltip, this.grid);
    this.gridView.onClick$.subscribe(pos => this.onGridClick(pos));
    this.onSpeedChange(this.defaultSpeed);
    console.log(this.grid);
  }

  onGridClick(pos: Pos): void {
    // console.log('Click', pos);
    this.grid.setCell(pos);
  }

  start(): void {
    this.animationService.start(this.grid);
  }

  pause(): void {
    this.animationService.stop();
  }

  clear(): void {
    this.grid.clear();
  }

  update(): void {
    this.grid.update();
  }

  onSpeedChange(speed: number): void {
    // Map speed [0, 100] to frames per update [51, 1]
    this.animationService.setFramesPerUpdate(51 - Math.ceil(speed / 2));
  }

  save(): void {
    saveAs(new Blob([this.grid.dumps()], {type: 'application/json'}), 'save.json');
  }

  load(event): void {
    if (event.target.files && event.target.files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const text = e.target.result;
        if (text) {
          this.grid.loads(text);
        }
      };
      fileReader.readAsText(event.target.files[0]);
    }
  }

}
