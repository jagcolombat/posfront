import {Component, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'dialog-delivery.component',
  templateUrl: 'dialog-delivery.component.html',
  styleUrls: ['dialog-delivery.component.scss']
})
export class DialogDeliveryComponent {
  title = "Invoices Types";
  subtitle = "Select a invoice type:";

  constructor(
    public dialogRef: MatDialogRef<DialogDeliveryComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.name) {
      this.title = this.data.name;
    }
    if (this.data.label) {
      this.subtitle = this.data.label;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

