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
    console.log('Before Connection', this.connection);
    this.connection.start().then(function () {
      console.log('Connected!', this.connection);
    }).catch(function (err) {
      return console.error(err.toString());
    });
    // Conection for entity
    this.connectionClientView.start().then(function (e) {
      console.log('Connected View!', e);
    }).catch(function (err) {
      return console.error(err.toString());
    });

    this.connection.on('scanner-event', (data: ScannerData) => {
      console.log('scanner-event', data.message);
      this.evScanner.emit(data);
    });

    this.connection.onclose((e)=> console.log('close connection ws', e));

    this.connectionClientView.on('app-invoice', (data: any) => {
      console.log('invoice-updated-event', data);
      this.evInvoiceUpdated.emit(data);
    });
  }

  stop(): void {
    this.connection.stop();
  }
}
