import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment as env} from '../../../../environments/environment';
import {WebsocketService} from "../../../services/api/websocket.service";
import {Subscription} from "rxjs";
import {InvoiceService} from "../../../services/bussiness-logic/invoice.service";
import {CashPaymentComponent} from "../../presentationals/cash-payment/cash-payment.component";
import {Invoice} from "../../../models/invoice.model";
import {InvoiceStatus} from "../../../utils/invoice-status.enum";
import {EOperationType} from "../../../utils/operation.type.enum";
import {InitViewService} from "../../../services/bussiness-logic/init-view.service";

@Component({
  selector: 'client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.scss']
})
export class ClientViewComponent implements OnInit, OnDestroy {
  public env = env;
  modalPaymentReturn: any;
  sub: Subscription[] = new Array<Subscription>();
  logged = false;
  //addProduct = true;

  constructor(private invoiceService: InvoiceService, private ws: WebsocketService, private initService: InitViewService) {
    //this.cashService.setSystemConfig();
  }

  ngOnInit() {
    this.initService.setOperation(EOperationType.InitCustomerScreen, 'Client View', 'Initialization');
    this.sub.push(this.ws.evInvoiceUpdated.subscribe(data => this.invoiceUpdated(data)));
    this.sub.push(this.ws.evOperation.subscribe(data => this.getOperation(data)));
    this.sub.push(this.ws.evReconnect.subscribe(data => this.wsReconnet(data)));
  }

  ngOnDestroy(): void {
    this.sub.map(sub => sub.unsubscribe());
  }

  private invoiceUpdated(data: any) {
    console.log('invoiceUpdated', data);
    this.initService.setOperation(EOperationType.UpdateInvoiceCustomerScreen, data.entity.id, 'Update invoice on customer screen');
    this.logged = true;
    this.invoiceService.cashier = data.entity.applicationUserName;
    //data.entity.addProduct = this.addProduct = !this.addProduct;
    (data.entity.addProduct && data.entity.productOrders.length > 0) ?
      this.addPO2Invoice(data.entity): this.invoiceService.setInvoice(data.entity);
    //Payment return
    if(data.entity.status !== InvoiceStatus.IN_PROGRESS && (data.entity.change > 0 || data.entity.change < 0)){
      this.showPaymentReturn(data.entity.change);
    } else {
      if(this.modalPaymentReturn) this.modalPaymentReturn.close();
    }
  }

  private showPaymentReturn(valueToReturn){
    console.log('showPaymentReturn', valueToReturn);
    this.modalPaymentReturn = this.invoiceService.cashService.dialog.open(CashPaymentComponent,
      {
        width: '350px', height: '260px', data: {value: valueToReturn}, disableClose: true
      });
  }

  private addPO2Invoice(inv: Invoice) {
    !this.invoiceService.invoice ? this.invoiceService.setInvoice(inv): this.invoiceService.addPO2Invoice(inv);
  }

  private getOperation(data: any) {
    console.log('getOperation', data);
    if(data.operationType === EOperationType.Disconnect){
      this.logged = false;
      this.invoiceService.cashService.dialog.closeAll();
    }
  }

  private wsReconnet(data?: boolean) {
    console.log('wsReconnet', this.ws.isConnected());
    this.initService.setOperation(EOperationType.ReconnectCustomerScreen, this.ws.isConnected()+'', 'Reconnect');
    if(!this.ws.isConnected()){
      this.ws.start();
    }
  }
}
