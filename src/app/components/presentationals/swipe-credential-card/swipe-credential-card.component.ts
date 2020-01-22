import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {InitViewService} from "../../../services/bussiness-logic/init-view.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-swipe-credential-card',
  templateUrl: './swipe-credential-card.component.html',
  styleUrls: ['./swipe-credential-card.component.scss']
})
export class SwipeCredentialCardComponent implements OnInit, OnDestroy {

  @Input() title : string;
  @Input() content: string;

  subscription: Subscription [] = [];

  constructor(public dialogRef: MatDialogRef<SwipeCredentialCardComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private initService: InitViewService) {
    this.subscription.push(this.initService.evUserScanned.subscribe(next => this.swipeCard(next))); }

  ngOnInit() {
    if (this.data.title) {
      this.title = this.data.title;
    }
    if (this.data.content) {
      this.content = this.data.content;
    }
  }

  swipeCard(pass: string){
    let userTmp = pass.substr(1, pass.length-2);
    console.log('handleKeyboardEvent', userTmp);
    this.initService.userScanned = userTmp;
    this.dialogRef.close(userTmp);
  }

  ngOnDestroy() {
    this.subscription.map(sub => sub.unsubscribe());
  }

}
