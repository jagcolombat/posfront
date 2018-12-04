import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataStorageService} from "../../shared/data-storage.service";
import {AuthService} from "../../services/connection/services/auth.service";
import {GenericInfoModalComponent} from "../generic-info-modal/generic-info-modal.component";
import {MatDialog} from "@angular/material";
import {FinancialOpComponent} from "../financial-op/financial-op.component";
import {FinancialOpService} from "../../services/financial-op.service";

@Component({
  selector: 'app-general-login',
  templateUrl: './general-login.component.html',
  styleUrls: ['./general-login.component.css']
})
export class GeneralLoginComponent implements OnInit {

  input = "";

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
              private authService: AuthService, private finService: FinancialOpService) { }

  ngOnInit() {
  }

  getKeys(ev) {
    console.log(ev);
    if(ev.type === 1) {
      this.input += ev.value;
    }
    else if(ev.value === 'Clear') {
      this.input = "";
    }
    else if(ev.value === 'Enter') {
      console.log(this.input);
      this.authService.login({ username: 'user', password: this.input }).subscribe(t => {
        console.log(t);
        /*this.valid = true;
        this.tryValidation = true;*/
        // console.log("login", this.valid);
        /*if(this.valid) {
          this.dialogRef.close(t.fullname);
        }*/
        this.finService.setUsername(this.authService.token.username);
        this.router.navigateByUrl('/home/dptos');
      }, error1 => {
        console.error(error1);
        this.input = "";
        const dialogRef = this.dialog.open(GenericInfoModalComponent,
          {
            width: '300px', height: '220px', data: {title: 'Error', content: 'Wrong identity'}
          });
        /*this.valid = false;
        this.tryValidation = true;*/
      });
    }
  }

}
