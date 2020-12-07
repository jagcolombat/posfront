import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'nameupc-cell',
  template: `<span class="name-cell">{{upcName[0]}}</span><br><span class="upc-cell">{{upcName[1]}}</span>`,
})
// tslint:disable-next-line:component-class-suffix
export class CustomNameupcCellComponent implements ICellRendererAngularComp {
  public params: any;
  public upcName: string[];

  agInit(params: any): void {
    console.log('CustomNameUPC');
    this.params = params;
    this.upcName = this.params.value.split(':');
  }

  refresh(): boolean {
    return false;
  }
}
