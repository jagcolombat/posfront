import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {FilterComponent} from "../../presentationals/filter/filter.component";

@Component({
  selector: 'app-dialog-filter',
  templateUrl: './dialog-filter.component.html',
  styleUrls: ['./dialog-filter.component.scss']
})
export class DialogFilterComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FilterComponent>) { }

  ngOnInit() {
  }

  closeDialog(text: string){
    this.dialogRef.close({text: text});
  }

}
