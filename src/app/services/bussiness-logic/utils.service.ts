import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material";
import {GenericInfoModalComponent} from "../../components/presentationals/generic-info-modal/generic-info-modal.component";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(public dialog: MatDialog) { }

  /***** Dialogs *****/
  /** Show informative popup **/
  openGenericInfo(title: string, content?: string, content2?: any, confirm?: boolean, disableClose?: boolean) {
    return this.dialog.open(GenericInfoModalComponent,{
      width: '400px', height: '350px', data: {
        title: title ? title : 'Information',
        content: content,
        content2: content2,
        confirm: confirm,
        disableClose: disableClose
      },
      disableClose: true
    });
  }
  /** Check if there is any dialog open  **/
  openDialogs(){
    return (this.dialog.openDialogs && this.dialog.openDialogs.length);
  }

  updateBrowser() {
    location.reload(true);
  }
}
