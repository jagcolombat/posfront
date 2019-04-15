import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AdminOptionsService} from "../../../services/bussiness-logic/admin-options.service";
import {leaveFocusOnButton} from "../../../utils/functions/functions";

@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrls: ['./admin-options.component.scss']
})
export class AdminOptionsComponent implements OnInit {
  options = ['Empl Z','SYS Z','WTD Z','Change Printer','Close Browser','Apply Discount','Cancel Check','Remove a hold','Departments'];
  page = 1;
  sizePage = 12;

  constructor(private router: Router, private adminOpService: AdminOptionsService ) {
  }

  ngOnInit() {
  }

  doAction(ev, opt: string) {
    console.log('doAction', opt);
    leaveFocusOnButton(ev);
    switch (opt) {
      case 'Departments':
        this.router.navigateByUrl('/cash/dptos');
        break;
      case 'Apply Discount':
        this.adminOpService.applyDiscount();
        break;
      case 'Empl Z':

        break;
      case 'SYS Z':

        break;
      case 'Cancel Check':
        this.adminOpService.cancelCheck();
        break;
    }
  }
}
