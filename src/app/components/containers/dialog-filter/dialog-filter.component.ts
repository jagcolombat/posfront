import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FilterComponent} from "../../presentationals/filter/filter.component";
import {ProductGeneric} from "../../../models/product-generic";

@Component({
  selector: 'app-dialog-filter',
  templateUrl: './dialog-filter.component.html',
  styleUrls: ['./dialog-filter.component.scss']
})
export class DialogFilterComponent implements OnInit {
  @Input() title = 'Filter';
  constructor(public dialogRef: MatDialogRef<FilterComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data.title) {
      this.title = this.data.title;
    }
  }

  closeDialog(text: string){
    this.dialogRef.close({text: text});
  }

}
