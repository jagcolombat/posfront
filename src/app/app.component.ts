import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { WEBSOCKET } from 'src/app/utils/url.path.enum';
import { ScannerData } from './models/scanner.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pos-front';
  connection: HubConnection;

  ngOnInit(): void {
    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl('http://localhost:5000/events' /* WEBSOCKET */) // Para poder probar en ambiente de desarrollo, para producion poner la constante
      .build();

      this.connection.start().then(function () {
      console.log('Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    this.connection.on('scanner-event', (data: ScannerData) => {
      // ScannerData tiene varios atributos, tienes que usar el upc
      console.log(data.message);
    });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.connection.stop();

  }
}
