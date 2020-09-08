import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pos-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() page = 1;
  @Input() countElements: number;
  @Input() sizePage: number = 12;
  @Input() disabled: boolean;
  @Output() evSetPage = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  setPage(ev) {
    this.page = ev;
    this.evSetPage.emit(ev);
  }

  next(paginator: any){
    if(!paginator.isLastPage()) paginator.next();
  }

  previous(paginator: any){
    if(!paginator.isFirstPage()) paginator.previous();
  }

}
