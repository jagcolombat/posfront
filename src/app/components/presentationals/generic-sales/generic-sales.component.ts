import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PaymentMethodEnum} from '../../../utils/operations/payment-method.enum';
import {Payment} from '../../../models';
import {DataStorageService} from '../../../services/api/data-storage.service';
import {CashService} from '../../../services/bussiness-logic/cash.service';
import {InvoiceService} from '../../../services/bussiness-logic/invoice.service';
import {OperationsService} from '../../../services/bussiness-logic/operations.service';
import { InformationType } from 'src/app/utils/information-type.enum';

@Component({
  selector: 'app-generic-sales',
  templateUrl: './generic-sales.component.html',
  styleUrls: ['./generic-sales.component.scss']
})
export class GenericSalesComponent implements OnInit {

  sales: Payment;
  salesByUser: any;
  recordsByUser: any;
  timeWorkedByUser: any;

  constructor( public dialogRef: MatDialogRef<GenericSalesComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService,
               private cashService: CashService, private invoiceService: InvoiceService, private operationService: OperationsService) {
    console.log('GenericSalesComponent', data);
    if (this.data.content) { this.populateSales(this.data.content); }
    if (this.data.empl && !this.data.date && !this.data.salesDate ) {
      this.getSales(this.data.empl.id); }
    if (this.data.empl && !this.data.date && this.data.salesDate) {
      this.getSalesByDate(this.data.empl.id, this.data.salesDate);
    }
    if (this.data.empl && this.data.date && !this.data.salesDate) {
      this.getRecords(this.data.empl.id, this.data.date);
    }
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  populateSales(data) {
    this.sales = data.map(payment => {
      return {'name': payment.name, 'total': payment.total};
    });
  }

  getSales(ev) {
    console.log('getSales', ev);
    if (ev) {
      this.dataStorage.getInvoiceByUser(ev).subscribe(next => {
        console.log(next);
        this.salesByUser = next;
      }, error1 => {
        console.error('getSales', error1);
        this.cashService.openGenericInfo('Error', error1);
      });
    }
  }

  getSalesByDate(ev, date) {
    console.log('getSalesByDate', ev, date);
    if (ev) {
      this.dataStorage.getInvoiceByUserAndDate(ev, date).subscribe(next => {
        console.log(next);
        this.salesByUser = next;
      }, error1 => {
        console.error('getSales', error1);
        this.cashService.openGenericInfo('Error', error1);
      });
    }
  }

  private getRecords(id: string, date: string) {
    console.log('getRecords', id, date);
    if (id && date) {
      this.dataStorage.getWorkerRecordsByUser(id, date).subscribe(records => {
        console.log('records', records);
        this.dataStorage.getTimeWorkedByUser(id, date).subscribe(time => {
          console.log('timeWorked', time);
          this.recordsByUser = records;
          this.timeWorkedByUser = time;
        }, error1 => this.cashService.openGenericInfo('Error', error1));
      }, error1 => {
        console.error('getSales', error1);
        this.cashService.openGenericInfo('Error', error1);
      });
    }
  }

  reviewCheck(receiptNumber: string) {
    this.invoiceService.digits = receiptNumber;
    this.operationService.reviewCheck();
    this.dialogRef.close();
  }

  onPrint() {
    console.log('Print invoices by user', this.data.empl);
    this.cashService.dialog.closeAll();
    let dialog;
    if ( this.data.empl) {
      dialog = this.cashService.openGenericInfo(InformationType.INFO, 'Printing report...');
      this.dataStorage.printInvoiceByUser( this.data.empl.id).subscribe(next => {
        dialog.close();
        console.log(next);
      }, error1 => {
        dialog.close();
        this.cashService.openGenericInfo(InformationType.ERROR, error1);
      });
    } else {
      console.log('Debe seleccionar un empleado');
    }

  }
}
