import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
/*import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { WEBSOCKET } from 'src/app/utils/url.path.enum';*/
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {WebsocketService} from "../../../services/api/websocket.service";
import {ISubscription} from "@aspnet/signalr";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-generic-info-events',
  templateUrl: './generic-info-events.component.html',
  styleUrls: ['./generic-info-events.component.scss']
})
export class GenericInfoEventsComponent implements OnInit, OnDestroy {
  private subscription: Subscription [] = [];
  public message: string;

  constructor(
    public dialogRef: MatDialogRef<GenericInfoEventsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ws: WebsocketService
  ) {
    this.subscription.push(ws.evPaidPax.subscribe(next=> this.setMessage(next)))
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscription.map(value => value.unsubscribe())
  }

  private setMessage(next: any) {
    console.log('setMessage', next);
    if (next && next.message) this.message = next.message;
  }
}
