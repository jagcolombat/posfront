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

  constructor(private invoiceService: InvoiceService, private operationService: OperationsService) {

  }

  ngOnInit() {
  }

  handleKeyboardEvent(ev: KeyboardEvent) {
    console.log('inputKeyboard', ev);
    if((ev.key==='Enter' || ev.keyCode === 13) && this.invoiceService.digits){
      this.operationService.scanProduct();
    } else {
      this.invoiceService.evNumpadInput.emit(ev.key);
    }
  }

}
