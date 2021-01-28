import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {InvoiceService} from '../../../services/bussiness-logic/invoice.service';
import {OperationsService} from '../../../services/bussiness-logic/operations.service';
import {FinancialOpEnum, InvioceOpEnum, TotalsOpEnum} from '../../../utils/operations';
import {WebsocketService} from '../../../services/api/websocket.service';
import {Subscription} from 'rxjs';
import {ScannerData} from '../../../models/scanner.model';
import {AdminOpEnum} from '../../../utils/operations/admin-op.enum';
import {AdminOptionsService} from '../../../services/bussiness-logic/admin-options.service';
import {InitViewService} from '../../../services/bussiness-logic/init-view.service';
import {InformationType} from '../../../utils/information-type.enum';
import {EOperationType} from '../../../utils/operation.type.enum';
import {ProductOrderService} from '../../../services/bussiness-logic/product-order.service';
import {InvoiceStatus} from '../../../utils/invoice-status.enum';

@Component({
  selector: 'app-cash-view',
  templateUrl: './cash-view.component.html',
  styleUrls: ['./cash-view.component.scss']
})
export class CashViewComponent implements OnInit, OnDestroy {
  sub: Subscription[] = new Array<Subscription>();
  passwordScan = '';
  dialogWSCloseConn: any;
  @HostListener('document:keypress', ['$event'])
  handleKeypressEvent(event: KeyboardEvent) {
    this.handleKeyboardEvent(event);
  }

  constructor(private invoiceService: InvoiceService, private operationService: OperationsService,
              private adminOpService: AdminOptionsService, private ws: WebsocketService,
              public initService: InitViewService, public productOrderService: ProductOrderService) {
    this.sub.push(this.ws.evScanner.subscribe(data => this.inputScanner(data)));
    this.sub.push(this.ws.evScannerPaidClose.subscribe(data => this.wsCloseConn(data)));
    this.sub.push(this.ws.evClientClose.subscribe(data => this.wsCloseClientConn(data)));
  }

  ngOnInit() {
    // this.ws.start();
    // this.invoiceService.cashService.resetEnableState();
    // if(this.invoiceService.authService.token) this.invoiceService.cashService.setSystemConfig();
    console.log('cashview init');
    this.initService.getStationStatus();
  }

  handleKeyboardEvent(ev: KeyboardEvent) {
    console.log('inputKeyboard', ev, isNaN(parseInt(ev.key)));
    if (this.operationService.cashService.disabledInput || this.operationService.cashService.disabledInputKey) {
      /*let tmpMdl;
      if(ev.key==='Enter' || ev.keyCode === 13) {
        tmpMdl = this.operationService.cashService
        .openGenericInfo('Error', 'Not possible input keyboard');}*/
      if ([TotalsOpEnum.SUBTOTAL + '', TotalsOpEnum.FS_SUBTOTAL + ''].includes(this.operationService.currentOperation) &&
        (ev.keyCode >= 48 && ev.keyCode < 57)) {
        console.log('Subtotal', this.invoiceService.digits, ev.key);
        this.invoiceService.evNumpadInput.emit(ev.key);
      }
    } else if ((ev.key === 'Enter' || ev.keyCode === 13)) {
      (this.invoiceService.digits) ? this.selectInputData() : this.passwordCard();
    } else if ((ev.keyCode > 48 && ev.keyCode < 57) || (ev.keyCode === 73  || ev.keyCode === 82 || ev.keyCode === 105 ||
        ev.keyCode === 114) || !isNaN(parseInt(ev.key)) ) {

      if (this.passwordScan.startsWith(';') || this.passwordScan.startsWith('%')) {
        this.passwordScan += ev.key.toUpperCase();
      } else {
        if (!this.operationService.cashService.openDialogs()) {
          this.invoiceService.evNumpadInput.emit(ev.key.toUpperCase());
        } else {
          console.log('No set digits because some dialog is showing');
        }
      }
    } else if ((ev.keyCode === 59  || ev.keyCode === 63 || ev.keyCode === 37 || ev.code === 'Comma' || ev.code === 'Minus' ||
      ev.code === 'Digit5')) {
      this.passwordScan += ev.key.toUpperCase();
    }
  }

  passwordCard() {
    this.initService.setOperation(EOperationType.Scanner, 'Password', 'Password: ' + this.passwordScan);
    if ((this.passwordScan.startsWith(';'))) {
      console.log('selectInputData passwordScan', this.passwordScan);
      this.initService.evUserScanned.emit(this.passwordScan);
    } else if ((this.passwordScan.startsWith('%'))) {
      console.log('selectInputData passwordScan', this.passwordScan);
    }
    this.passwordScan = '';
  }

  selectInputData() {
    this.initService.setOperation(EOperationType.Scanner, 'InvoiceOrProduct', 'InvoiceOrProduct:' +
      this.invoiceService.digits);
    if (this.invoiceService.digits.startsWith('I') || this.invoiceService.digits.startsWith('R')) {
      // this.operationService.scanInvoice();
      if (!this.operationService.cashService.openDialogs()) {
        this.operationService.scanInvoice();
      } else {
        this.invoiceService.resetDigits();
      }
    } else {
      // console.log('selectInputData', this.operationService.currentOperation, this.adminOpService.currentOperation);
      if (this.operationService.currentOperation === InvioceOpEnum.PRICE) {
        this.operationService.priceCheck();
      } else if (this.adminOpService.currentOperation === AdminOpEnum.CHANGE_PRICES) {
        this.adminOpService.changePrice();
      } else {
        if (this.invoiceService.allowAddProductByStatus() && !this.operationService.cashService.openDialogs()) {
          this.operationService.scanProduct();
        } else {
          this.invoiceService.resetDigits();
        }
      }
    }
  }

  inputScanner(data: ScannerData) {
    console.log('inputScanner', data);
    // if([TotalsOpEnum.SUBTOTAL+'', TotalsOpEnum.FS_SUBTOTAL+''].includes(this.operationService.currentOperation)){
    if (this.invoiceService.invoice.status !== InvoiceStatus.PENDENT_FOR_PAYMENT ||
      this.operationService.currentOperation !== FinancialOpEnum.REVIEW) {
      if (data.upc) {
        this.invoiceService.numbers = this.invoiceService.digits = data.upc;
        // this.invoiceService.digits = data.upc;
        // this.operationService.scanProduct();
        this.selectInputData();
      } else {
        console.error('Object scanned haven´t UPC property');
        if (this.invoiceService.allowAddProductByStatus()) {
          this.operationService.cashService.openGenericInfo(InformationType.ERROR,
            'Object scanned have not UPC property');
        }
      }
    } else {
      this.operationService.cashService.openGenericInfo(InformationType.INFO,
        'You cannot add products in Subtotal or Review state please select Clear option first.');
    }

  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    // this.ws.stop();
    this.sub.map(sub => sub.unsubscribe());
  }

  private wsCloseConn(data: any) {
    console.log('wsCloseConn', data);
    if (!this.dialogWSCloseConn) { this.showMsgWSClose(); }
  }

  private wsCloseClientConn(data: any) {
    console.log('wsCloseClientConn', data);
    if (!this.dialogWSCloseConn) { this.showMsgWSClose(); }
  }

  showMsgWSClose() {
    this.dialogWSCloseConn = this.operationService.cashService.openGenericInfo(InformationType.INFO,
      'Scanner is not working. Select Yes to retry', null, true, true);
    this.dialogWSCloseConn.afterClosed().subscribe(
      next => {
        if (next && next.confirm) {
          this.ws.start();
          this.ws.evReconnect.emit();
          this.dialogWSCloseConn = null;
        }
      });
  }
}
