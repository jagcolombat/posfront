import {Component, OnDestroy, OnInit} from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import {WebsocketService} from "../../../services/api/websocket.service";
import {Subscription} from "rxjs";
import {InvoiceService} from "../../../services/bussiness-logic/invoice.service";

@Component({
  selector: 'client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.scss']
})
export class ClientViewComponent implements OnInit, OnDestroy {
  public env = env;
  sub: Subscription[] = new Array<Subscription>();

  constructor(private invoiceService: InvoiceService, private ws: WebsocketService) {

  }

  ngOnInit() {
    this.sub.push(this.ws.evInvoiceUpdated.subscribe(data => this.invoiceUpdated(data)));
  }

  ngOnDestroy(): void {
    this.sub.map(sub => sub.unsubscribe());
  }

  private invoiceUpdated(data: any) {

  }
}
