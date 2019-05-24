import {Component, OnInit, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-generic-info-modal',
  templateUrl: './generic-info-modal.component.html',
  styleUrls: ['./generic-info-modal.component.scss']
})
export class GenericInfoModalComponent implements OnInit {

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

}
