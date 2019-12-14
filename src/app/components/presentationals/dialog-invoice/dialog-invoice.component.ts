import {Component, Inject} from "@angular/core";
import {Invoice} from "../../../models/invoice.model";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EOperationType} from "../../../utils/operation.type.enum";
import {Table} from "../../../models/table.model";
import {DialogFilterComponent} from "../../containers/dialog-filter/dialog-filter.component";
import {CashService} from "../../../services/bussiness-logic/cash.service";

@Component({
  selector: 'dialog-invoice.component',
  templateUrl: 'dialog-invoice.component.html',
  styleUrls: ['dialog-invoice.component.scss']
})
export class DialogInvoiceComponent {
  title = "Invoices";
  subtitle = "Select a invoice:";
  page = 1;
  sizePage = 12;
  showFilter: true;

  constructor(
    private cashService: CashService,
    public dialogRef: MatDialogRef<DialogInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if(data.title) this.title = data.title;
    if(data.subtitle) this.subtitle = data.subtitle;
    if(data.filter) this.showFilter = data.filter;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setPage(ev){
    this.page = ev;
  }

  filter() {
    this.cashService.dialog.open(DialogFilterComponent, { width: '1024px', height: '600px', disableClose: true})
      .afterClosed()
      .subscribe(next => {
        if (next) {
          console.log('filterDialog', next, this.data.invoice);
          let invoices = this.data.invoice.filter(i => i.orderInfo && i.orderInfo.toUpperCase().includes(next.text));
          invoices.length <= 0 ?
            this.cashService.openGenericInfo('Information', 'Not match any invoices with the specified filter')
            : this.data.invoice = invoices;
          this.page = 1;
        }
      });
  }

}

