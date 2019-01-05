import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.scss']
})
export class DialogLoginComponent implements OnInit {
  rol: string = 'Administrator';
  constructor(public dialogRef: MatDialogRef<DialogLoginComponent>) { }

  ngOnInit() {
  }

  closeDialog(){
    this.dialogRef.close(true);
  }
}
