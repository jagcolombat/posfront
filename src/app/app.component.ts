import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pos-front';

  /*@HostListener('document: keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log('handleKeyboardEvent', event);
  }*/
  private _hubConnection: HubConnection;

  ngOnInit(): void {
    this._hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5000/events').build();
    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    this._hubConnection.on('paid-credit', (data) => {
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    this._hubConnection.stop();
  }
}
