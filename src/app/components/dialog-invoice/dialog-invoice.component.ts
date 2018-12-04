import {Component, Inject} from "@angular/core";
import {Invoice} from "../../models/invoice.model";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'dialog-invoice.component',
  templateUrl: 'dialog-invoice.component.html',
  styleUrls: ['dialog-invoice.component.css']
})
export class DialogInvoiceComponent {
  title = "Holder Orders";
  subtitle = "Select a hold order:";
  constructor(
    public dialogRef: MatDialogRef<DialogInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Invoice[]) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

