import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import {InitViewService} from '../../../services/bussiness-logic/init-view.service';
import {Subscription} from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'init-view',
  templateUrl: './init-view.component.html',
  styleUrls: ['./init-view.component.scss']
})
export class InitViewComponent implements OnInit, AfterViewInit, OnDestroy {
  public env = env;
  @ViewChild('init') init: ElementRef;
  loginScan = '';
  pathPromotions = 'promotions/';
  pathAnnounces = 'anuncios/';
  showClock: boolean;
  showLogin: boolean;
  sub: Subscription[] = new Array<Subscription>();

  @HostListener('document:keypress', ['$event'])
  handleKeypressEvent(event: KeyboardEvent) {
    this.handleKeyboardEvent(event);
  }

  constructor(public initService: InitViewService) {}

  ngOnInit() {
    console.log('initview init');
    this.showLogin = this.initService.config.sysConfig ? true : false;
    this.showClock = this.initService.config.sysConfig.allowClock;
    this.initService.getStationStatus();
  }

  handleKeyboardEvent(ev: KeyboardEvent) {
    console.log('inputKeyboard', ev, isNaN(parseInt(ev.key)));
    if (ev.key === 'Enter' || ev.keyCode === 13) {
      /*if(this.invoiceService.digits.startsWith('I') || this.invoiceService.digits.startsWith('R')){
        this.operationService.scanInvoice();
      } else {
        (this.operationService.currentOperation === InvioceOpEnum.PRICE)? this.operationService.priceCheck() :
          this.operationService.scanProduct();
      }*/
      if (this.loginScan.startsWith(';') && this.loginScan.endsWith('?')) {
        this.initService.userScanned = this.loginScan;
        this.initService.evUserScanned.emit(this.initService.userScanned);
        this.loginScan = '';
      } else {
        console.log('no match with login card pattern', this.loginScan);
        this.loginScan = '';
      }
    } else if ((ev.keyCode > 48 && ev.keyCode < 57) || (ev.keyCode === 59  || ev.keyCode === 63 || ev.code === 'Comma' ||
      ev.code === 'Minus') || !isNaN(parseInt(ev.key)) ) {
      this.loginScan += ev.key.toUpperCase();
    }
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit', this.init.nativeElement.offsetWidth, this.init.nativeElement.offsetHeight);
    this.env.screenH = this.init.nativeElement.offsetHeight;
  }

  ngOnDestroy(): void {
  }
}
