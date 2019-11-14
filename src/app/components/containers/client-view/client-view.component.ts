import { Component, OnInit } from '@angular/core';
import { environment as env } from '../../../../environments/environment';

@Component({
  selector: 'client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.scss']
})
export class ClientViewComponent implements OnInit {
  public env = env;
  constructor() { }

  ngOnInit() {
  }

}
