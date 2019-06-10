import { Component, OnInit } from '@angular/core';

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
  numbers = [1,2,3,4,5,6,7,8,9,0,'A', 'B','C', 'D','E', 'F','G', 'H','I', 'J','K', 'L','M', 'N','O', 'P','Q', 'R'
    ,'S', 'T','U', 'V','W', 'X','Y', 'Z'];
  operations = ['Back', 'Clear', 'Enter'];
  opColor = ['yellow','yellow', 'red'];

  constructor() { }

  ngOnInit() {
  }

  getKeys(ev) {
    console.log(ev, this.numbers.slice(-3));
    if(!this.operations.includes(ev)) {
      this.input += ev;
      this.tryValidation = false;
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

  }
}
