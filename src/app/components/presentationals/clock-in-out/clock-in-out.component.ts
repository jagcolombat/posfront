import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EClockType} from "../../../utils/clock-type.enum";

@Component({
  selector: 'clock-in-out',
  templateUrl: './clock-in-out.component.html',
  styleUrls: ['./clock-in-out.component.scss']
})
export class ClockInOutComponent implements OnInit {
  @Output() evClock = new EventEmitter<string>();
  @Input() clock: boolean;
  clockValue: Array<EClockType>;
  clockLabel: Array<string>;

  constructor() { }

  ngOnInit() {
    this.clockValue = [EClockType.IN, EClockType.OUT];
    this.clockLabel = [EClockType[EClockType.IN], EClockType[EClockType.OUT]];
  }

  clockAction(ev){
    this.evClock.emit(ev);
  }

}
