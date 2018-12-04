import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-input-price',
  templateUrl: './input-price.component.html',
  styleUrls: ['./input-price.component.css']
})
export class InputPriceComponent implements OnInit {

  @Input() price = '0000';
  @Input() character: string | number;
  @Input() priceNumber = 0;

  priceChange = new Subject();
  characterChange = new Subject();

  constructor() { }

  ngOnInit() {
    this.characterChange.subscribe(val => {
        this.price += val;
        if (this.character === '00' && this.price[0] === '0' && this.price[1] === '0') {
          this.price = this.price.substring(2);
        } else
        if (this.price.startsWith('0')) {
          this.price = this.price.substring(1);
        }
        console.log(this.price);
        this.getCashNumber();
        this.priceChange.next();
    });
  }

  clear() {
    this.price = '0000';
    this.getCashNumber();
  }

  delete() {
    this.price = this.price.substr(0, this.price.length - 1);
      if (this.price.length < 4) {
        this.price = '0' + this.price;
      }
    this.getCashNumber();
  }

  getCashNumber() {
    const part1 = this.price.substr(0, this.price.length - 2);
    const part2 = this.price.substr(this.price.length - 2, 2);
    const cashNumber = part1 + '.' + part2;
    this.priceNumber = Number.parseFloat(cashNumber);
    console.log(this.priceNumber);
  }

}
