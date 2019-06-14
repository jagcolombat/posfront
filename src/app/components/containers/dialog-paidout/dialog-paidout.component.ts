import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {FilterComponent} from "../../presentationals/filter/filter.component";

@Component({
  selector: 'app-dialog-paidout',
  templateUrl: './dialog-paidout.component.html',
  styleUrls: ['./dialog-paidout.component.scss']
})
export class DialogPaidoutComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FilterComponent>) { }

  ngOnInit() {
  }

  closeDialog(text: string){
    this.dialogRef.close({text: text});
  }

}
