import {Component, ViewChild, ElementRef} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ICellRendererAngularComp, IHeaderAngularComp} from 'ag-grid-angular';
@Component({
  selector: 'app-loading-overlay',
  template: `
      <div>
          <div #headerButton class="customHeaderLabel" (click)="onMenuClicked($event)">{{ params.displayName }}</div>
      </div>`,
  styles: [`
      .customHeaderLabel {
          margin-left: 5px;
          margin-top: 3px;
      }
    `]
})
export class CustomHeaderComponent implements IHeaderAngularComp {
  public params: any;
  @ViewChild('headerButton', {read: ElementRef}) public headerButton;

  constructor(public dialog: MatDialog ) { }

  agInit(params): void {
    this.params = params;
  }

  onMenuClicked() {
    // console.log('onMenuClicked', this.params, this.headerButton);
    this.params.context.componentParent.selectOrDeselectAll();
  }

  refresh(params: any): boolean {
    return false;
  }
}
