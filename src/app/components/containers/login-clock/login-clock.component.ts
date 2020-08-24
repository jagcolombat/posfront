import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoginComponent} from "../../presentationals/login/login.component";

@Component({
  selector: 'login-clock',
  templateUrl: './login-clock.component.html',
  styleUrls: ['./login-clock.component.scss']
})
export class LoginClockComponent implements OnInit {

  @Input() showClock: boolean;
  @ViewChild('login') login: LoginComponent;

  constructor() { }

  ngOnInit() {
  }

  clockInOut(ev) {
    console.log('clockInOut', ev, this.login.input)
  }

}
