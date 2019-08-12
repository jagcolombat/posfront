import {Component, Inject} from "@angular/core";
import {Invoice} from "../../../models/invoice.model";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EOperationType} from "../../../utils/operation.type.enum";

@Component({
  selector: 'dialog-invoice.component',
  templateUrl: 'dialog-invoice.component.html',
  styleUrls: ['dialog-invoice.component.css']
})
export class DialogInvoiceComponent {
  title = "Invoices";
  subtitle = "Select a invoice:";
  page = 1;
  sizePage = 9;
  constructor(
    public dialogRef: MatDialogRef<DialogInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Invoice[]) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  setPage(ev){
    /*if(ev > this.page){
      this.stockService.setOperation(EOperationType.PageNext, ev, 'hold order');
    } else {
      this.stockService.setOperation(EOperationType.PagePrevious, ev, 'hold order');
    }
    this.page = this.stockService.actualPage = ev;*/
    this.page = ev;
  }

}

