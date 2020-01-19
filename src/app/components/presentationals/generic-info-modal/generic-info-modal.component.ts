import {Component, OnInit, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-generic-info-modal',
  templateUrl: './generic-info-modal.component.html',
  styleUrls: ['./generic-info-modal.component.scss']/*,
  host: {
    '(document:keypress)': 'handleKeyboardEvent($event)'
  }*/
})
export class GenericInfoModalComponent implements OnInit {

  passwordScan='';

  constructor( public dialogRef: MatDialogRef<GenericInfoModalComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

  onConfirm(): void {
    this.dialogRef.close({confirm: true});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  swipeCard(pass: string){
    let userTmp = pass.substr(1, pass.length-2);
    console.log('handleKeyboardEvent', userTmp);
    this.dialogRef.close('porfa');
  }

  handleKeyboardEvent(ev: KeyboardEvent) {
    console.log('inputKeyboard', ev, isNaN(parseInt(ev.key)));
    if(ev.key==='Enter' || ev.keyCode === 13){
      if(this.passwordScan.startsWith(';') && this.passwordScan.endsWith('?')){
        this.swipeCard(this.passwordScan);
        //this.passwordScan = '';
      } else {
        console.log('no match with login card pattern', this.passwordScan);
        this.passwordScan = '';
      }
    } else if((ev.keyCode > 48 && ev.keyCode < 57) || (ev.keyCode === 59  || ev.keyCode === 63 || ev.code === 'Comma' ||
      ev.code === 'Minus') || !isNaN(parseInt(ev.key)) ){
      this.passwordScan +=ev.key.toUpperCase();
    }
  }

}
