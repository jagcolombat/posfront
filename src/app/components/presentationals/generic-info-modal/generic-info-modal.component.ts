import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-generic-info-modal',
  templateUrl: './generic-info-modal.component.html',
  styleUrls: ['./generic-info-modal.component.scss']
})
export class GenericInfoModalComponent implements OnInit {

  passwordScan = '';

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

  close() {
    return (this.data.disableClose === undefined || this.data.disableClose === false) ? true: false;
  }

}
