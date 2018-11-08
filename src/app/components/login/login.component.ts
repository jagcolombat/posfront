import {Component, Inject, OnInit} from '@angular/core';
import {LoginData} from "../../shared/login-data";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LoginService} from "../../services/login.service";
import {AuthService} from "../../services/connection/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  tryValidation:boolean;
  valid: boolean;
  constructor(public dialogRef: MatDialogRef<LoginComponent>,
              @Inject(MAT_DIALOG_DATA) public data: LoginData,
              private authService: AuthService) {

  }

  ngOnInit() {
  }

  login(){
    console.log("login", this.data);
    this.data.user = 'admin';
    // this.data.pass = 'Angel*2018';
    this.authService.login({ username:this.data.user, password: this.data.pass }).subscribe(t => {
      console.log(t);
      this.valid = true;
      this.tryValidation = true;
      // console.log("login", this.valid);
      if(this.valid) {
        this.dialogRef.close(t.fullname);
      }
    }, error1 => {
      console.error(error1);
      this.valid = false;
      this.tryValidation = true;
    });

  }

}
