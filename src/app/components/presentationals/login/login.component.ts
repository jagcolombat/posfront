import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/api/auth.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { InitViewService } from '../../../services/bussiness-logic/init-view.service';
import { Subscription } from 'rxjs';
import { UserrolEnum } from '../../../utils/userrol.enum';
import { NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CashService } from 'src/app/services/bussiness-logic/cash.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() evRol = new EventEmitter<boolean>();
  @Input() rol: UserrolEnum[];
  @ViewChild('loginForm') loginForm: NgForm;

  input = '';
  tryValidation: boolean;
  valid: boolean;
  errorMsg: string;
  subscription: Subscription [] = [];

  constructor(private router: Router, private route: ActivatedRoute, public authService: AuthService, 
    private initService: InitViewService, private cashService: CashService) {
    this.subscription.push(this.initService.evUserScanned.subscribe(next => this.userScan(next)));
  }

  ngOnInit() {
  }

  login(userScan?: boolean) {
    this.authService.login({ username: 'user', password: this.input })
    .pipe(debounceTime(1000))
    .subscribe(t => {
      if(userScan) this.cashService.disabledInput = false;
      this.loginOK(t);
    }, error1 => {
      if(userScan) this.cashService.disabledInput = false;
      this.loginFail(error1);
    });
  }

  loginOK (data) {
    console.log('loginOK', data);
    if (this.rol)  {
      this.verifyRol(data, this.rol);
    } else {
      this.validAuth();
    }
  }

  loginFail(e) {
    console.error(e);
    this.invalidAuth(/*'Invalid authentication'*/e);
  }

  verifyRol(data, rol) {
    console.log('verifyRol', data, rol);
    if (this.rol.includes(data.rol)) {
      this.validAuth();
    } else {
      this.invalidAuth('User not authorized');
    }
  }

  validAuth() {
    this.valid = true;
    this.tryValidation = true;
    (this.rol) ? this.evRol.emit(true) : this.selectRoute();
  }

  selectRoute() {
    (this.authService.adminLogged()) ? 
      this.router.navigateByUrl('/cash/options', { replaceUrl: true }) :
      this.router.navigateByUrl('/cash', { replaceUrl: true });
  }

  invalidAuth(msg?: string) {
    console.log('verifyRol', msg);
    this.valid = false;
    this.tryValidation = true;
    this.input = '';
    this.errorMsg = msg ? msg : '';
  }

  getKeys(ev) {
    // console.log(ev);
    if (ev.type === 1) {
      this.input += ev.value;
      this.tryValidation = false;
    } else if (ev.value === 'Clear') {
      this.input = '';
    } else if (ev.value === 'Enter') {
      console.log(this.input);
      this.login();
    } else if (ev.value === 'Back') {
      this.back();
    }
  }

  back() {
    if (this.input.length > 0 ) {
      this.input = this.input.slice(0, this.input.length - 1);
    }
  }

  resetLogin() {
    this.input = '';
    this.tryValidation = false;
    this.valid = false;
  }

  ngOnDestroy() {
    this.subscription.map(sub => sub.unsubscribe());
  }

  private userScan(user: string) {
    const userTmp = user.substr(1, user.length - 2);
    console.log('userScan', user, userTmp);
    this.input = userTmp;
    console.log('route', this.route.snapshot.firstChild);
    const cash = (this.route.snapshot.firstChild.url.find(seg => seg.path === 'cash') ? true : false);
    if (!this.initService.config.sysConfig.allowClock || cash) {
      this.login(true);
    }
  }
}
