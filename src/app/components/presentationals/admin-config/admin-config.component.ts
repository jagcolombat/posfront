import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DataStorageService} from "../../../services/api/data-storage.service";
import {AdminOpEnum} from "../../../utils/operations/admin-op.enum";
import {CloseBatch} from "../../../utils/close.batch.enum";

@Component({
  selector: 'admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss']
})
export class AdminConfigComponent implements OnInit {
  timeLogout: number;
  adminClearVoid: boolean;
  closeBatch:boolean;
  typeCloseBatch:number;
  cb = CloseBatch;

  constructor( public dialogRef: MatDialogRef<AdminConfigComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService) {
  }

  ngOnInit() {
    this.closeBatch = this.data.title=== AdminOpEnum.CLOSE_BATCH;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setTime4Logout($event:any) {
    console.log('setTime4Logout', $event, this.timeLogout)
  }

  setAdmin4ClearVoid($event: any) {
    console.log('setAdmin4ClearVoid', $event, this.adminClearVoid)
  }

  setTypeCloseBatch($event: any) {
    console.log('setTypeCloseBatch', $event, this.typeCloseBatch)
  }

  done(){
    if(this.closeBatch)
      this.dialogRef.close(this.typeCloseBatch);
    else {
      this.dialogRef.close();
    }
  }
}
