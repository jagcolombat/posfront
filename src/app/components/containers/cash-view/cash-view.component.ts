import {Component, OnInit} from '@angular/core';
import {InvoiceService} from "../../../services/bussiness-logic/invoice.service";
import {OperationsService} from "../../../services/bussiness-logic/operations.service";

@Component({
  selector: 'app-cash-view',
  templateUrl: './cash-view.component.html',
  styleUrls: ['./cash-view.component.scss'],
  host: {
    '(document:keypress)': 'handleKeyboardEvent($event)'
  }
})
export class CashViewComponent implements OnInit {

  constructor(private invoiceService: InvoiceService, private operationService: OperationsService) { }

  ngOnInit() {
  }

  handleKeyboardEvent(ev: KeyboardEvent) {
    console.log('inputKeyboard', ev, isNaN(parseInt(ev.key)));
    if(this.operationService.cashService.disabledInput){
      this.operationService.openGenericInfo('Error', 'Not possible input keyboard over Review ' +
        'Check operation, please Go Back first.');
    } else if((ev.key==='Enter' || ev.keyCode === 13) && this.invoiceService.digits){
      this.operationService.scanProduct();
    } else if((ev.keyCode > 48 && ev.keyCode < 57) || !isNaN(parseInt(ev.key)) ){
      this.invoiceService.evNumpadInput.emit(ev.key);
    }
  }

}
