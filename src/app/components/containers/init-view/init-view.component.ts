import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { environment as env } from '../../../../environments/environment';

@Component({
  selector: 'init-view',
  templateUrl: './init-view.component.html',
  styleUrls: ['./init-view.component.scss']
})
export class InitViewComponent implements OnInit, AfterViewInit, OnDestroy {
  public env = env;
  @ViewChild('init') init: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit', this.init.nativeElement.offsetWidth, this.init.nativeElement.offsetHeight);
    this.env.screenH = this.init.nativeElement.offsetHeight;
  }

  ngOnDestroy() {
  }
}
