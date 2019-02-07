import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-debit-card',
  templateUrl: './debit-card.component.html',
  styleUrls: ['./debit-card.component.scss']
})
export class DebitCardComponent implements OnInit {

  input = "";
  tryValidation:boolean;
  valid: boolean;
  cardInvalid = true;
  card: string;
  pin: string;

  constructor(public dialogRef: MatDialogRef<DebitCardComponent>) {
  }

  ngOnInit() {
  }

  getKeys(ev) {
    console.log(ev);
    if(ev.type === 1) {
      this.input += ev.value;
      this.tryValidation = false;
    }
    else if(ev.value === 'Clear') {
      this.input = "";
    }
    else if(ev.value === 'Enter') {
      console.log(this.input);
      (this.cardInvalid)? this.validCard(this.input) : this.validPin(this.input);
      this.input = "";
    }
    else if(ev.value === 'Back') {
      this.back();
    }
  }

  validCard(card){
    this.cardInvalid = false;
    this.card = card;
  }

  validPin(pin){
    this.cardInvalid = true;
    this.pin = pin;
    this.dialogRef.close();
  }

  back() {
    if(this.input.length > 0 ) {
      this.input = this.input.slice(0, this.input.length - 1);
    }
  }

}
