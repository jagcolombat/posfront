import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {UserrolEnum} from "../../../utils/userrol.enum";
import {AuthService} from "../../../services/api/auth.service";
import {Token} from "../../../models";

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.scss']
})
export class DialogLoginComponent implements OnInit, OnDestroy {
  rol: UserrolEnum[];
  cashierToken: Token;

  constructor(public dialogRef: MatDialogRef<DialogLoginComponent>, private authService: AuthService) {
    this.cashierToken = this.authService.token;
    this.rol = this.authService.adminRoles;
  }

  ngOnInit() {
  }

  closeDialog(){
    this.dialogRef.close({valid: true, token: this.cashierToken});
  }

  ngOnDestroy() {
    this.cashierToken = null;
  }
}
