import {Component, OnDestroy, OnInit} from '@angular/core';
import {InvoiceService} from "../../../services/bussiness-logic/invoice.service";
import {OperationsService} from "../../../services/bussiness-logic/operations.service";
import {InvioceOpEnum} from "../../../utils/operations";
import {WebsocketService} from "../../../services/api/websocket.service";
import {Subscription} from "rxjs";
import {ScannerData} from "../../../models/scanner.model";
import {AdminOpEnum} from "../../../utils/operations/admin-op.enum";
import {AdminOptionsService} from "../../../services/bussiness-logic/admin-options.service";
import {InitViewService} from "../../../services/bussiness-logic/init-view.service";

@Component({
  selector: 'app-cash-view',
  templateUrl: './cash-view.component.html',
  styleUrls: ['./cash-view.component.scss'],
  host: {
    '(document:keypress)': 'handleKeyboardEvent($event)'
  }
})
export class CashViewComponent implements OnInit, OnDestroy {

  sub: Subscription[] = new Array<Subscription>();
  passwordScan = '';

  constructor(private invoiceService: InvoiceService, private operationService: OperationsService,
              private adminOpService: AdminOptionsService, private ws: WebsocketService, private initService: InitViewService) {
  }

  ngOnInit() {
    //this.ws.start();
    //this.invoiceService.cashService.resetEnableState();
    if(this.invoiceService.authService.token) this.invoiceService.cashService.setSystemConfig();
    this.sub.push(this.ws.evScanner.subscribe(data => this.inputScanner(data)));
  }

  handleKeyboardEvent(ev: KeyboardEvent) {
    console.log('inputKeyboard', ev, isNaN(parseInt(ev.key)));
    if(this.operationService.cashService.disabledInput || this.operationService.cashService.disabledInputKey){
      /*let tmpMdl;
      if(ev.key==='Enter' || ev.keyCode === 13) {
        tmpMdl = this.operationService.cashService
        .openGenericInfo('Error', 'Not possible input keyboard');}*/
    } else if((ev.key==='Enter' || ev.keyCode === 13)){
      (this.invoiceService.digits) ? this.selectInputData() : this.passwordCard();
    } else if((ev.keyCode > 48 && ev.keyCode < 57) || (ev.keyCode === 73  || ev.keyCode === 82 || ev.keyCode === 105 ||
        ev.keyCode === 114) || !isNaN(parseInt(ev.key)) ){

      (this.passwordScan.startsWith(';') || this.passwordScan.startsWith('%')) ?
        this.passwordScan += ev.key.toUpperCase() : this.invoiceService.evNumpadInput.emit(ev.key.toUpperCase());

    } else if ((ev.keyCode === 59  || ev.keyCode === 63 || ev.keyCode === 37 || ev.code === 'Comma' || ev.code === 'Minus' || ev.code === 'Digit5')){
      this.passwordScan += ev.key.toUpperCase();
    }
  }

  passwordCard() {
    if ((this.passwordScan.startsWith(';'))) {
      console.log('selectInputData passwordScan', this.passwordScan);
      this.initService.evUserScanned.emit(this.passwordScan);
      this.passwordScan = '';
    } else if ((this.passwordScan.startsWith('%'))) {
      console.log('selectInputData passwordScan', this.passwordScan);
      this.passwordScan = '';
    }
  }

  selectInputData(){
    if(this.invoiceService.digits.startsWith('I') || this.invoiceService.digits.startsWith('R')){
      this.operationService.scanInvoice();
    } else {
      //console.log('selectInputData', this.operationService.currentOperation, this.adminOpService.currentOperation);
      if(this.operationService.currentOperation === InvioceOpEnum.PRICE) {
        this.operationService.priceCheck();
      } else if (this.adminOpService.currentOperation === AdminOpEnum.CHANGE_PRICES) {
        this.adminOpService.changePrice();
      } else {
        this.operationService.scanProduct();
      }
    }
  }

  inputScanner(data: ScannerData){
    console.log('inputScanner', data);
    if(data.upc){
      this.invoiceService.numbers = this.invoiceService.digits = data.upc;
      //this.invoiceService.digits = data.upc;
      //this.operationService.scanProduct();
      this.selectInputData();
    } else {
      console.error("Object scanned haven´t UPC property");
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    //this.ws.stop();
    this.sub.map(sub => sub.unsubscribe());
  }
}
