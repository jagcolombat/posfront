import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import {FilterComponent} from "../../presentationals/filter/filter.component";

@Component({
  selector: 'app-dialog-paidout',
  templateUrl: './dialog-paidout.component.html',
  styleUrls: ['./dialog-paidout.component.scss']
})
export class DialogPaidoutComponent implements OnInit {
  title: string = "Paid out";

  constructor(public dialogRef: MatDialogRef<FilterComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.title) {
      this.title = this.data.title;
    }
  }

  ngOnInit() {
  }

  closeDialog(text: string){
    this.dialogRef.close({text: text});
  }

}
