import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'operation-group',
  templateUrl: './operation-group.component.html',
  styleUrls: ['./operation-group.component.scss']
})
export class OperationGroupComponent implements OnInit, OnChanges {
  @Input() operations: string[];
  @Input() colors: string | string[];
  @Input() disable: boolean | boolean[] = false;
  @Input() layout: string;
  @Output() evPressKeys = new EventEmitter<any>();

  constructor() { }

  ngOnChanges(sc: SimpleChanges){
    console.log('onchanges', sc);
    /*if(sc.disable){
    }*/
  }

  ngOnInit() { }

  pressKey(ev, val: string | number) {
    console.log(val);
    ev.target.blur();
    this.evPressKeys.emit(val);
  }

  setColor(index) {
    return typeof this.colors === 'string' ? this.colors : this.colors[this.operations.indexOf(index)]
  }

  setDisabled(index) {
    return typeof this.disable === 'boolean' ? this.disable : this.disable[this.operations.indexOf(index)]
  }
}
