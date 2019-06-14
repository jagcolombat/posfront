import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  input = "";
  tryValidation:boolean;
  valid: boolean;
  errorMsg: string;
  numbers = [1,2,3,4,5,6,7,8,9,0,
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A',
    'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C',
    'V', 'B','N', 'M'];
  operations = ['Back', 'Clear', 'Enter'];
  opColor = ['yellow','yellow', 'red'];
  @Output() evFilter = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  getKeys(ev) {
    console.log(ev, this.numbers.slice(-3));
    if(!this.operations.includes(ev) && ev !== 'Space') {
      this.input += ev;
      this.tryValidation = false;
    }
    else if(ev=== 'Space') {
      this.input += " ";
    }
    else if(ev=== 'Clear') {
      this.input = "";
    }
    else if(ev === 'Enter') {
      console.log(this.input);
      this.filter()
    }
    else if(ev === 'Back') {
      this.back();
    }
  }

  back() {
    if(this.input.length > 0 ) {
      this.input = this.input.slice(0, this.input.length - 1);
    }
  }

  private filter() {
    let text = this.input.trim();
    console.log('filter', text);
    (text.length > 1 && text.length <= 100) ? this.evFilter.emit(text):
      this.invalid('Text must have between 2 and 100 characters');
  }

  invalid(msg?: string) {
    this.valid = false;
    this.tryValidation = true;
    this.errorMsg = msg ? msg : ''
  }
}
