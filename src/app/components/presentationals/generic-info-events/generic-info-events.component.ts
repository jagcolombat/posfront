import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { WEBSOCKET } from 'src/app/utils/url.path.enum';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-generic-info-events',
  templateUrl: './generic-info-events.component.html',
  styleUrls: ['./generic-info-events.component.scss']
})
export class GenericInfoEventsComponent implements OnInit, OnDestroy {
  private _hubConnection: HubConnection;
  public message: string;

  constructor(
    public dialogRef: MatDialogRef<GenericInfoEventsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(WEBSOCKET)
      .build();
    this._hubConnection
      .start()
      .then(() => {
        this.message = 'Connection started!';
        console.log(this.message);
      })
      .catch(err => {
        this.message = 'Error while establishing connection';
        console.log(this.message);
      });

    this._hubConnection.on('paid-credit', data => {
      this.message = data.message;
    });
  }

  ngOnDestroy(): void {
    this._hubConnection.stop();
  }
}
