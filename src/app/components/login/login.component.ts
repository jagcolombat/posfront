import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {AuthService} from "../../services/connection/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  input = "";
  tryValidation:boolean;
  valid: boolean;
  authorize: boolean;

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
              private authService: AuthService) {

  }

  ngOnInit() {
  }

  login(){
    // console.log("login", this.data);
    // this.data.user = 'admin';
    this.authService.login({ username: 'user', password: this.input }).subscribe(t => {
      console.log(t);
      if (t.rol === "Administrator")  {
        this.valid = true;
        this.tryValidation = true;
        this.authorize = true;
        if(this.valid) {
          this.dialogRef.close(t.fullname);
        }
      } else {
        console.error("El usuario no es un administrador");
        this.valid = false;
        this.authorize = false;
        this.tryValidation = true;
        this.input = "";
      }
    }, error1 => {
      console.error(error1);
      this.valid = false;
      this.authorize = false;
      this.tryValidation = true;
      this.input = "";
    });

  }

  getKeys(ev) {
    console.log(ev);
    if(ev.type === 1) {
      this.input += ev.value;
      this.tryValidation = false;
    }
    else if(ev.value === 'Clear') {
      this.input = "";
    }
    else if(ev.value === 'Enter') {
      console.log(this.input);
      this.login()
    }
  }

}
