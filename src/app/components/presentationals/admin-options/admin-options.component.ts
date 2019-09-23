import {Component, Input, OnInit} from '@angular/core';
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
  @Input() disable: boolean | boolean[] = this.adminOpService.cashService.disabledAdminOp;
  adminOpColor = "red";

  constructor(private router: Router, public adminOpService: AdminOptionsService ) {
  }

  ngOnInit() {
  }

  doAction(opt: string) {
    console.log('doAction', opt);
    switch (opt) {
      case AdminOpEnum.DEPARMENTS.toUpperCase():
        this.router.navigateByUrl('/cash/dptos');
        break;
      case AdminOpEnum.APPLY_DISCOUNT.toUpperCase():
        this.adminOpService.applyDiscount();
        break;
      case AdminOpEnum.EMPLZ.toUpperCase():
        this.adminOpService.emplZ();
        break;
      case AdminOpEnum.SYSZ.toUpperCase():
        this.adminOpService.sysZ();
        break;
      case AdminOpEnum.CANCEL_CHECK.toUpperCase():
        this.adminOpService.cancelCheck();
        break;
      case AdminOpEnum.REMOVE_HOLD.toUpperCase():
        this.adminOpService.removeAHold();
        break;
      case AdminOpEnum.BACK_USER.toUpperCase():
        this.adminOpService.backToUser();
        this.router.navigateByUrl('/cash/dptos');
        break;
      case AdminOpEnum.CONFIG.toUpperCase():
        this.adminOpService.configOption();
        // this.router.navigateByUrl('/cash/dptos');
        break;
      case AdminOpEnum.SYSTEM_VERSION.toUpperCase():
        this.adminOpService.systemVersion();
        break;
      case AdminOpEnum.CLOSE_BATCH.toUpperCase():
        this.adminOpService.closeBatch();
        break;
      case AdminOpEnum.WTDZ.toUpperCase():
        this.adminOpService.doDayClose();
        break;
    }
  }

  setDisabled(index) {
    return typeof this.disable === 'boolean' ? this.disable : this.disable[this.options.indexOf(index)]
  }
}
