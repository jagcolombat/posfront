import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'clock-in-out',
  templateUrl: './clock-in-out.component.html',
  styleUrls: ['./clock-in-out.component.scss']
})
export class ClockInOutComponent implements OnInit {
  @Output() evClock = new EventEmitter<string>();
  @Input() clock: boolean;

  constructor() { }

  ngOnInit() {
  }

  clockAction(ev){
    this.evClock.emit(ev);
  }

}
