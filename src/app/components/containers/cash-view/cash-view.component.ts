import {Component, OnInit} from '@angular/core';
import {InvoiceService} from "../../../services/bussiness-logic/invoice.service";
import {OperationsService} from "../../../services/bussiness-logic/operations.service";
import {InvioceOpEnum} from "../../../utils/operations";

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
    if(this.operationService.cashService.disabledInput || this.operationService.cashService.disabledInputKey){
      /*let tmpMdl;
      if(ev.key==='Enter' || ev.keyCode === 13) {
        tmpMdl = this.operationService.cashService
        .openGenericInfo('Error', 'Not possible input keyboard');}*/
    } else if((ev.key==='Enter' || ev.keyCode === 13) && this.invoiceService.digits){
      if(this.invoiceService.digits.startsWith('I') || this.invoiceService.digits.startsWith('R')){
        this.operationService.scanInvoice();
      } else {
        (this.operationService.currentOperation === InvioceOpEnum.PRICE)? this.operationService.priceCheck() :
        this.operationService.scanProduct();
      }

    } else if((ev.keyCode > 48 && ev.keyCode < 57) || (ev.keyCode === 73  || ev.keyCode === 82 || ev.keyCode === 105 ||
        ev.keyCode === 114) || !isNaN(parseInt(ev.key)) ){
      this.invoiceService.evNumpadInput.emit(ev.key.toUpperCase());
    }
  }

}
