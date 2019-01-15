import {Component, OnDestroy, OnInit} from '@angular/core';
import { environment as env } from '../../../../environments/environment';

@Component({
  selector: 'init-view',
  templateUrl: './init-view.component.html',
  styleUrls: ['./init-view.component.scss']
})
export class InitViewComponent implements OnInit, OnDestroy {
  public env = env;
  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
