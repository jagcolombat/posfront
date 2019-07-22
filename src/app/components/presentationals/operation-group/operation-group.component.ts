import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {leaveFocusOnButton} from "../../../utils/functions/functions";

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
  @Input() btnSize: string = "100px";
  @Input() upperCase: boolean = false;
  @Output() evPressKeys = new EventEmitter<any>();

  constructor() { }

  ngOnChanges(sc: SimpleChanges){
    console.log('onchanges', sc);
    /*if(sc.disable){
    }*/
  }

  ngOnInit() {
    if(this.upperCase) this.operations=this.operations.map(o=> o.toUpperCase());
  }

  pressKey(ev, val: string | number) {
    console.log(val);
    leaveFocusOnButton(ev);
    this.evPressKeys.emit(val);
  }

  setColor(index) {
    return typeof this.colors === 'string' ? this.colors : this.colors[this.operations.indexOf(index)]
  }

  setDisabled(index) {
    return typeof this.disable === 'boolean' ? this.disable : this.disable[this.operations.indexOf(index)]
  }
}
