import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import {InvioceOpEnum} from "../../../utils/operations";
import {InitViewService} from "../../../services/bussiness-logic/init-view.service";

@Component({
  selector: 'init-view',
  templateUrl: './init-view.component.html',
  styleUrls: ['./init-view.component.scss'],
  host: {
    '(document:keypress)': 'handleKeyboardEvent($event)'
  }
})
export class InitViewComponent implements OnInit, AfterViewInit, OnDestroy {
  public env = env;
  @ViewChild('init') init: ElementRef;
  loginScan = '';

  constructor(private initService: InitViewService) {
  }

  ngOnInit() {
  }

  handleKeyboardEvent(ev: KeyboardEvent) {
    console.log('inputKeyboard', ev, isNaN(parseInt(ev.key)));
    if((ev.key==='Enter' || ev.keyCode === 13) && (this.loginScan.startsWith(';') && (this.loginScan.endsWith('?')))){
      /*if(this.invoiceService.digits.startsWith('I') || this.invoiceService.digits.startsWith('R')){
        this.operationService.scanInvoice();
      } else {
        (this.operationService.currentOperation === InvioceOpEnum.PRICE)? this.operationService.priceCheck() :
          this.operationService.scanProduct();
      }*/
      this.initService.userScanned = this.loginScan;
      this.initService.evUserScanned.emit(this.initService.userScanned);
      this.loginScan = '';

    } else if((ev.keyCode > 48 && ev.keyCode < 57) || (ev.keyCode === 59  || ev.keyCode === 63 || ev.code === 'Comma' ||
      ev.code === 'Minus') || !isNaN(parseInt(ev.key)) ){
      this.loginScan +=ev.key.toUpperCase();
    }
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit', this.init.nativeElement.offsetWidth, this.init.nativeElement.offsetHeight);
    this.env.screenH = this.init.nativeElement.offsetHeight;
  }

  ngOnDestroy() {
  }
}
