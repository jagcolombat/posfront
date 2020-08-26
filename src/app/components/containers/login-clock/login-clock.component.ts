import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoginComponent} from "../../presentationals/login/login.component";
import {DataStorageService} from "../../../services/api/data-storage.service";
import {UtilsService} from "../../../services/bussiness-logic/utils.service";
import {InformationType} from "../../../utils/information-type.enum";
import {UserrolEnum} from "../../../utils/userrol.enum";
import {EClockType} from "../../../utils/clock-type.enum";

@Component({
  selector: 'login-clock',
  templateUrl: './login-clock.component.html',
  styleUrls: ['./login-clock.component.scss']
})
export class LoginClockComponent implements OnInit {

  @Input() showClock: boolean;
  @ViewChild('login') login: LoginComponent;

  constructor(public dataStore: DataStorageService, private utils: UtilsService) { }

  ngOnInit() {
  }

  clockInOut(ev: EClockType) {
    console.log('clockInOut', ev, this.login.input);
    if(this.login.input.trim()==='' || this.login.input.length < 4 ){
      this.utils.openGenericInfo(InformationType.ERROR, 'Password must have at least 4 characters for clock in/out');
      this.login.resetLogin();
      return;
    }
    this.dataStore.employClock({ username: 'user', password: this.login.input }, ev).subscribe(
      next => {
        let token = this.login.authService.decodeToken(next.token);
        console.log(next, token);
        (token.rol === UserrolEnum.WORKER || ev === EClockType.OUT)?
          this.showClockMsg(next.message):
          this.login.selectRoute();
      }, error1 => {
        console.error(error1);
        this.utils.openGenericInfo(InformationType.ERROR, error1);
        this.login.resetLogin();
      }
    )
  }

  showClockMsg(msg: string){
    this.utils.openGenericInfo(InformationType.INFO, msg);
    this.login.resetLogin();
  }

}
