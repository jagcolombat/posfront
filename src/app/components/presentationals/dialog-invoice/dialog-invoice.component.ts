import {Component, Inject} from "@angular/core";
import {Invoice} from "../../../models/invoice.model";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EOperationType} from "../../../utils/operation.type.enum";
import {Table} from "../../../models/table.model";

@Component({
  selector: 'dialog-invoice.component',
  templateUrl: 'dialog-invoice.component.html',
  styleUrls: ['dialog-invoice.component.scss']
})
export class DialogInvoiceComponent {
  title = "Invoices";
  subtitle = "Select a invoice:";
  page = 1;
  sizePage = 9;
  constructor(
    public dialogRef: MatDialogRef<DialogInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if(data.title) this.title = data.title;
    if(data.subtitle) this.subtitle = data.subtitle;
  }

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

