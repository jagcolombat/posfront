import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss']
})
export class OrderInfoComponent implements OnInit {
  @Input() title = 'Order Info';
  @Input() subtitle: string;
  @Input() details = new Array<any>();

  constructor(public dialogRef: MatDialogRef<OrderInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data.title) {
      this.title = this.data.title;
    }
    if (this.data.subtitle) {
      this.subtitle = this.data.subtitle;
    }
    if (this.data.type) {
      console.log('Order Info', this.data.type, this.data.account);
      if (this.data.type.table) {
        this.details.push({ key: 'Table', label: this.data.type.table.label });
      } else {
        if (this.data.type.client) {
          if (this.data.type.client.name) {
            this.details.push({key: 'Client Name', label: this.data.type.client.name});
          }
          if (this.data.type.client.address) {
            this.details.push({key: 'Client Address', label: this.data.type.client.address});
          }
          if (this.data.type.client.telephone) {
            this.details.push({key: 'Client Phone', label: this.data.type.client.telephone});
          }
          if (this.data.account.balance !== undefined) {
            this.details.push({key: 'Account Balance', label: '$ ' + this.data.account.balance.toFixed(2)});
          }
          if (this.data.account.credit !== undefined) {
            this.details.push({key: 'Available Credit', label: '$ ' + this.data.account.credit.toFixed(2)});
          }
          if (this.data.account.creditLimit !== undefined) {
            this.details.push({key: 'Credit Limit', label: '$ ' + this.data.account.creditLimit.toFixed(2)});
          }
          if (this.data.type.description) {
            this.details.push({key: 'Description', label: this.data.type.description});
          }
        }
      }
    }
  }

  onAction() {
    console.log('Order Info - onAction');
    this.dialogRef.close({print: true});
  }
}
