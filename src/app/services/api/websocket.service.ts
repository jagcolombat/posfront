import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import {ScannerData} from "../../models/scanner.model";
import { WEBSOCKET } from 'src/app/utils/url.path.enum';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  connection: HubConnection;
  // Events
  @Output() evScanner = new EventEmitter<any>();

  constructor() {
    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl('http://localhost:5000/events')
      .build();
    this.start();
  }

  start() {
    this.connection.start().then(function () {
      console.log('Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    this.connection.on('scanner-event', (data: ScannerData) => {
      // ScannerData tiene varios atributos, tienes que usar el upc
      console.log(data.message);
      this.evScanner.emit(data);
    });
  }

  stop(): void {
    this.connection.stop();
  }
}
