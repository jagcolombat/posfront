import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-weight-product',
  templateUrl: './weight-product.component.html',
  styleUrls: ['./weight-product.component.scss']
})
export class WeightProductComponent implements OnInit {
  @Input() upc = "";
  @Input() meassure = "LB";
  @Input() weight = 0;
  @Input() name = "";

  constructor() { }

  ngOnInit() {
  }

  reset() {
    this.upc= "";
    this.name= "";
    this.weight= 0;
  }

}
