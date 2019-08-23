import {Component, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EDeliveryType} from "../../../utils/delivery.enum";

@Component({
  selector: 'dialog-delivery.component',
  templateUrl: 'dialog-delivery.component.html',
  styleUrls: ['dialog-delivery.component.scss']
})
export class DialogDeliveryComponent {
  title = "Invoices Types";
  subtitle = "Select a invoice type:";

  constructor(
    public dialogRef: MatDialogRef<DialogDeliveryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[]) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

