import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'order-info-details',
  templateUrl: './order-info-details.component.html',
  styleUrls: ['./order-info-details.component.scss']
})
export class OrderInfoDetailsComponent implements OnInit {
  @Input() details: [{ key: string, label: string }];

  constructor() { }

  ngOnInit() {
  }

}
