import { EventEmitter, Injectable, Output } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { ScannerData } from '../../models/scanner.model';
import { serverURL, EVENTS, CLIENTVIEW } from 'src/app/utils/url.path.enum';
import { Subscription, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  connection: HubConnection;
  connectionClientView: HubConnection;
  connected: boolean;
  duration = 3000;
  retry_max_count = 5;
  retry_current = 0;

  // Events
  @Output() evScanner = new EventEmitter<any>();
  @Output() evInvoiceUpdated = new EventEmitter<any>();
  @Output() evOperation = new EventEmitter<any>();
  @Output() evPaidPax = new EventEmitter<any>();
  @Output() evStationStatus = new EventEmitter<any>();
  @Output() evScannerPaidClose = new EventEmitter<any>();
  @Output() evClientClose = new EventEmitter<any>();
  @Output() evReconnect = new EventEmitter<any>();

  constructor() {
    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(serverURL + EVENTS)
      .build();
    this.connectionClientView = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(serverURL + CLIENTVIEW)
      .build();
    this.start();
  }

  start() {
    // Connection for events
    this.setConnectionEvents(this);
    // Connection for entity
    this.setConnectionClient(this);
    // Subscribe scanner event
    this.receiveScanner();
    // Subscribe operation event
    this.receiveOperation();
    // Subscribe invoice event
    this.receiveInvoice();
    // Subscribe paid event
    this.receivePaidPax();
    // Subscribe station status event
    this.receiveStationStatus();
    // Subscribe stop event
    this.receiveConnectionStop();
    // Subscribe stop client
    this.receiveConnectionClientStop();
  }

  setConnectionEvents(context?: any) {
    this.connection.start().then(function () {
      console.log('Connected!', context.connection);
      context.connected = true;
    }).catch(function (err) {
      // context.evScannerPaidClose.emit();
      context.connected = false;
      return console.error(err.toString());
    });
  }

  setConnectionClient(context = this) {
    this.connectionClientView.start().then(function (e) {
      console.log('Connected View!', e);
      context.connected = true;
    }).catch(function (err) {
      context.connected = false;
      context.evClientClose.emit(context.duration);
      context.retryConnection();
      return console.error(err.toString());
    });
  }

  receiveScanner() {
    this.connection.on('scanner-event', (data: ScannerData) => {
      console.log('scanner-event', data.message);
      this.evScanner.emit(data);
    });
  }

  receiveOperation() {
    this.connectionClientView.on('operation-event', (data: any) => {
      console.log('operation-event', data);
      this.evOperation.emit(data);
    });
  }

  receiveInvoice() {
    this.connectionClientView.on('app-invoice', (data: any) => {
      console.log('invoice-updated-event', data);
      this.evInvoiceUpdated.emit(data);
    });
  }
  receivePaidPax() {
    this.connection.on('paid-credit', data => {
      console.log('paid-credit-event', data);
      this.evPaidPax.emit(data);
    });
  }

  receiveStationStatus() {
    this.connection.on('station-status', (data: any) => {
      console.log('station-status', data);
      this.evStationStatus.emit(data);
    });
  }

  receiveConnectionStop() {
    this.connection.onclose((e) => {
      console.log('close connection ws', e);
      this.connected = false;
      this.evScannerPaidClose.emit(e);
    });
  }

  receiveConnectionClientStop() {
    this.connectionClientView.onclose((e) => {
      console.log('close connection client view ws', e);
      this.connected = false;
      // this.evClientClose.emit(e);
      this.retryConnection();
    });
  }

  retryConnection() {
    const time = timer(this.duration);
    const sub = time.subscribe((n) => {
      this.retry_current++;
      (this.retry_current < this.retry_max_count) ? this.setConnectionClient() : this.finishRetry(sub);
    });
  }

  finishRetry(sub: Subscription) {
    console.log('finishRetry');
    sub.unsubscribe();
    this.retry_current = 0;
    this.evClientClose.emit(0);
  }

  isConnected(): boolean {
    return this.connected;
  }

  stop(): void {
    this.connection.stop();
  }
}
