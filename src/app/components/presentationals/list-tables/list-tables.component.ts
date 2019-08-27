import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../../../models/table.model";

@Component({
  selector: 'app-list-tables',
  template: `
    <button mat-button fxFlex="170px" *ngFor="let i of data | paginate: { itemsPerPage: sizePage, currentPage: page }"
            [mat-dialog-close]="i">
      {{i.label }}<p>{{i.employ }}</p>
    </button>
  `,
  styleUrls: ['./list-tables.component.scss']
})
export class ListTablesComponent implements OnInit {
  @Input() data: Table[];
  @Input() sizePage: number;
  @Input() page: number;

  constructor() { }

  ngOnInit() {
  }

}
