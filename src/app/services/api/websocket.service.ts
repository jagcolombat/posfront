import { EventEmitter, Injectable, Output } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { ScannerData } from "../../models/scanner.model";
import { WEBSOCKET } from 'src/app/utils/url.path.enum';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  connection: HubConnection;
  connectionClientView: HubConnection;
  // Events
  @Output() evScanner = new EventEmitter<any>();
  @Output() evInvoiceUpdated = new EventEmitter<any>();
  @Output() evOperation = new EventEmitter<any>();

  constructor() {
    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl('http://localhost:5000/events')
      .build();
    this.connectionClientView = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl('http://localhost:5000/entity')
      .build();
    this.start();
  }

  start() {
    // Conection for events
    this.setConnectionEvents();
    // Conection for entity
    this.setConnectionClient();
    //Subscribe scanner event
    this.receiveScanner();
    //Subscribe operation event
    this.receiveOperation();
    //Subscribe invoice event
    this.receiveInvoice();
    //Subscribe stop event
    this.receiveConnectionStop();
    //Subscribe stop client
    this.receiveConnectionClientStop();
  }

  setConnectionEvents(){
    this.connection.start().then(function () {
      console.log('Connected!', this.connection);
    }).catch(function (err) {
      return console.error(err.toString());
    });
  }

  setConnectionClient(){
    this.connectionClientView.start().then(function (e) {
      console.log('Connected View!', e);
    }).catch(function (err) {
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

  receiveConnectionStop(){
    this.connection.onclose((e)=> {
      console.log('close connection ws', e);
    });
  }

  receiveConnectionClientStop(){
    this.connection.onclose((e)=> {
      console.log('close connection ws', e);
    });
  }

  stop(): void {
    this.connection.stop();
  }
}
