import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cash-payment',
  templateUrl: './cash-payment.component.html',
  styleUrls: ['./cash-payment.component.css']
})
export class CashPaymentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CashPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  ngOnInit() {
  }

  onPrint() {
      console.log(this.data);
      this.dialogRef.close(this.data);
  }

}
