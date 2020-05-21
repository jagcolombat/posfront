import { EventEmitter, Injectable, Output } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { ScannerData } from "../../models/scanner.model";
import { serverURL, EVENTS, CLIENTVIEW } from 'src/app/utils/url.path.enum';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  connection: HubConnection;
  connectionClientView: HubConnection;
  connected: boolean;
  // Events
  @Output() evScanner = new EventEmitter<any>();
  @Output() evInvoiceUpdated = new EventEmitter<any>();
  @Output() evOperation = new EventEmitter<any>();
  @Output() evPaidPax = new EventEmitter<any>();
  @Output() evScannerPaidClose= new EventEmitter<any>();
  @Output() evClientClose= new EventEmitter<any>();
  @Output() evReconnect= new EventEmitter<any>();

  constructor() {
    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(serverURL+EVENTS)
      .build();
    this.connectionClientView = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(serverURL+CLIENTVIEW)
      .build();
    this.start();
  }

  start() {
    // Conection for events
    this.setConnectionEvents(this);
    // Conection for entity
    this.setConnectionClient(this);
    //Subscribe scanner event
    this.receiveScanner();
    //Subscribe operation event
    this.receiveOperation();
    //Subscribe invoice event
    this.receiveInvoice();
    //Subscribe paid event
    this.receivePaidPax();
    //Subscribe stop event
    this.receiveConnectionStop();
    //Subscribe stop client
    this.receiveConnectionClientStop();
  }

  setConnectionEvents(context?: any){
    this.connection.start().then(function () {
      console.log('Connected!', this.connection);
      this.connected = true;
    }).catch(function (err) {
      //context.evScannerPaidClose.emit();
      this.connected = false;
      return console.error(err.toString());
    });
  }

  setConnectionClient(context?: any){
    this.connectionClientView.start().then(function (e) {
      console.log('Connected View!', e);
      context.connected = true;
    }).catch(function (err) {
      context.connected = false;
      context.evClientClose.emit();
      return console.error(err.toString());
    });
  }

  receiveScanner(){
    this.connection.on('scanner-event', (data: ScannerData) => {
      console.log('scanner-event', data.message);
      this.evScanner.emit(data);
    });
  }

  receiveOperation(){
    this.connectionClientView.on('operation-event', (data: any) => {
      console.log('operation-event', data);
      this.evOperation.emit(data);
    });
  }

  receiveInvoice(){
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

  receiveConnectionStop(){
    this.connection.onclose((e)=> {
      console.log('close connection ws', e);
      this.connected = false;
      this.evScannerPaidClose.emit(e);
    });
  }

  receiveConnectionClientStop(){
    this.connectionClientView.onclose((e)=> {
      console.log('close connection client view ws', e);
      this.connected = false;
      this.evClientClose.emit(e);
    });
  }

  isConnected(): boolean{
    return this.connected;
  }

  stop(): void {
    this.connection.stop();
  }
}
