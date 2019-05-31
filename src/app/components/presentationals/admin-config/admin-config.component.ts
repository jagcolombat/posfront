import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DataStorageService} from "../../../services/api/data-storage.service";

@Component({
  selector: 'admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss']
})
export class AdminConfigComponent implements OnInit {
  timeLogout: number;
  adminClearVoid: boolean;
  constructor( public dialogRef: MatDialogRef<AdminConfigComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService) {
    console.log(data);
    // if(this.data.content) this.populateSales(this.data.content);
  }

  ngOnInit() {
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
}
