import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {AuthService} from "../../../services/api/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() rol: string;
  input = "";
  tryValidation:boolean;
  valid: boolean;
  errorMsg: string;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  login(){
    this.authService.login({ username: 'user', password: this.input }).subscribe(t => {
      this.loginOK(t, this.rol);
    }, error1 => {
      this.loginFail(error1);
    });
  }

  loginOK (data, rol?: string) {
    console.log('loginOK', data, rol);
    if (rol)  {
      this.verifyRol(data, rol);
    } else {
      this.validAuth();
    }
  }

  loginFail(e) {
    console.error(e);
    this.invalidAuth('Invalid authentication')
  }

  verifyRol(data, rol) {
    console.log('verifyRol', data, rol);
    if(rol === data.rol) {
      this.validAuth();
    } else {
      this.invalidAuth('User not authorized');
    }
  }

  validAuth() {
    this.valid = true;
    this.tryValidation = true;
    // this.dialogRef.close(t.fullname);
    this.router.navigateByUrl('/cash');
  }

  invalidAuth(msg?: string) {
    console.log('verifyRol', msg);
    this.valid = false;
    this.tryValidation = true;
    this.input = "";
    this.errorMsg = msg ? msg : ''
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
    else if(ev.value === 'Back') {
      this.back();
    }
  }

  back() {
    if(this.input.length > 0 ) {
      this.input = this.input.slice(0, this.input.length - 1);
    }
  }

}
