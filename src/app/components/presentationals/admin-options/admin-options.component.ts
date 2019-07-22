import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AdminOptionsService} from "../../../services/bussiness-logic/admin-options.service";
import {leaveFocusOnButton} from "../../../utils/functions/functions";
import {AdminOpEnum} from "../../../utils/operations/admin-op.enum";

@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrls: ['./admin-options.component.scss']
})
export class AdminOptionsComponent implements OnInit {
  options = [AdminOpEnum.EMPLZ, AdminOpEnum.SYSZ, AdminOpEnum.WTDZ,AdminOpEnum.CHANGE_PRINTER,AdminOpEnum.CLOSE_BROWSER,
    AdminOpEnum.APPLY_DISCOUNT, AdminOpEnum.CANCEL_CHECK, AdminOpEnum.REMOVE_HOLD, AdminOpEnum.DEPARMENTS,
    AdminOpEnum.BACK_USER, AdminOpEnum.CLOSE_BATCH, AdminOpEnum.CONFIG, AdminOpEnum.SYSTEM_VERSION];
  page = 1;
  sizePage = 16;

  constructor(private router: Router, private adminOpService: AdminOptionsService ) {
  }

  ngOnInit() {
  }

  doAction(ev, opt: string) {
    console.log('doAction', opt);
    leaveFocusOnButton(ev);
    switch (opt) {
      case AdminOpEnum.DEPARMENTS:
        this.router.navigateByUrl('/cash/dptos');
        break;
      case AdminOpEnum.APPLY_DISCOUNT:
        this.adminOpService.applyDiscount();
        break;
      case AdminOpEnum.EMPLZ:
        this.adminOpService.emplZ();
        break;
      case AdminOpEnum.SYSZ:
        this.adminOpService.sysZ();
        break;
      case AdminOpEnum.CANCEL_CHECK:
        this.adminOpService.cancelCheck();
        break;
      case AdminOpEnum.REMOVE_HOLD:
        this.adminOpService.removeAHold();
        break;
      case AdminOpEnum.BACK_USER:
        this.adminOpService.backToUser();
        this.router.navigateByUrl('/cash/dptos');
        break;
      case AdminOpEnum.CONFIG:
        this.adminOpService.configOption();
        // this.router.navigateByUrl('/cash/dptos');
        break;
      case AdminOpEnum.SYSTEM_VERSION:
        this.adminOpService.systemVersion();
        break;
      case AdminOpEnum.CLOSE_BATCH:
        this.adminOpService.closeBatch();
        break;
    }
  }
}
