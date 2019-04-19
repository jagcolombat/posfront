import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sales-shop',
  templateUrl: './sales-shop.component.html',
  styleUrls: ['./sales-shop.component.scss']
})
export class SalesShopComponent implements OnInit {
  @Input() sales: any;
  constructor() { }

  ngOnInit() {
  }

}
