import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-ops',
  templateUrl: './payment-ops.component.html',
  styleUrls: ['./payment-ops.component.css']
})
export class PaymentOpsComponent implements OnInit {
  specials = ["Food Stamp", "EBT CASH"];
  cards = ["Debit Card", "Credit Card"];
  space = "10px";
  constructor() { }

  ngOnInit() {
  }

}
