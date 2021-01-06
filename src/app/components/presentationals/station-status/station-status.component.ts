import {Component, Input, OnInit} from '@angular/core';
import {EStationStatus} from '../../../utils/station-status.enum';

@Component({
  selector: 'app-station-status',
  templateUrl: './station-status.component.html',
  styleUrls: ['./station-status.component.scss']
})
export class StationStatusComponent implements OnInit {
  @Input() status: EStationStatus;

  constructor() { }

  ngOnInit() {
  }

  getStatus(): boolean {
    return (this.status && this.status === EStationStatus.ONLINE) ? true : false;
  }

}
