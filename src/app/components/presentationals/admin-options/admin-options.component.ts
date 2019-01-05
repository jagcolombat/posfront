import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrls: ['./admin-options.component.scss']
})
export class AdminOptionsComponent implements OnInit {
  options = ['Empl Z','SYS Z','WTD Z','Change Printer','Close Browser','Apply Discount','Cancel Check','Remove a hold','Departments'];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  doAction(opt: string) {
    console.log('doAction', opt);
    if(opt === 'Departments') this.router.navigateByUrl('/cash/dptos');
  }
}
