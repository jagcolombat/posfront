import {Component, OnInit} from '@angular/core';
import {InvoiceService} from "../../../services/bussiness-logic/invoice.service";

@Component({
  selector: 'app-cash-view',
  templateUrl: './cash-view.component.html',
  styleUrls: ['./cash-view.component.scss'],
  host: {
    '(document:keypress)': 'handleKeyboardEvent($event)'
  }
})
export class CashViewComponent implements OnInit {

  constructor(private invoiceService: InvoiceService) {

  }

  ngOnInit() {
  }

  handleKeyboardEvent(ev: KeyboardEvent) {
    console.log('inputKeyboard', ev);
    this.invoiceService.evNumpadInput.emit(ev.key);
  }

}
