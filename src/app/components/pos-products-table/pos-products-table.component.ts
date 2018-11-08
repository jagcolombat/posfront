import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { EColumns } from '../../utils/columns.enum';
import { getDisplayColumnsToProductsTable } from '../../utils/invoce.functions';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Product } from '../../models/product.model';
import { SelectionModel } from '@angular/cdk/collections';
import {ProductsService} from "../../services/products.service";
import {IProductOrder, ProductOrder} from "../../models/order.model";

@Component({
    selector: 'pos-products-table',
    templateUrl: './pos-products-table.component.html',
    styleUrls: ['./pos-products-table.component.css']
})
export class PosProductsTableComponent implements OnInit {
    displayedColumns: string[] = [];
    @Input() typeColumns: EColumns[];
    @Input() multipleSelection = true;
    @Input() showPagination = true;
    @Input() elevation = true;
    dataSource = new MatTableDataSource<IProductOrder>();
    selection;
    @Output() editEvent: EventEmitter<any>;
    @Output() deleteEvent: EventEmitter<any>;
    @Output() selectEvent: EventEmitter<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private elem: ElementRef, private prodService: ProductsService) {
        this.editEvent = new EventEmitter<any>();
        this.deleteEvent = new EventEmitter<any>();
        this.selectEvent = new EventEmitter<any>();
        this.typeColumns = [
            EColumns.UPC,
            EColumns.DESCRIPTION,
            EColumns.PRICE,
            EColumns.QUANTITY,
            EColumns.AMOUNT
        ];
        this.prodService.evAddProd.subscribe(p => this.addProduct(p));
    }

    ngOnInit() {
        this.displayedColumns = getDisplayColumnsToProductsTable(this.typeColumns);
        this.selection = new SelectionModel<IProductOrder>(this.multipleSelection, []);
    }

    setPaginatorToDataSource = () => {
        this.dataSource.paginator = this.paginator;
    };

    @Input()
    set products(products: IProductOrder[]) {
        console.log(products);
        this.dataSource = new MatTableDataSource<IProductOrder>(products);
        this.selection = new SelectionModel<IProductOrder>(this.multipleSelection, []);
        this.showPagination && this.setPaginatorToDataSource();
        this.syncProducts();
    }

    addProduct(product: ProductOrder) {
      const data = this.dataSource.data;
      data.push(product);
      this.dataSource.data = data;
      this.scrollBottom();
      this.syncProducts();
    }

    syncProducts() {
      this.prodService.products = this.dataSource.data;
      this.prodService.evSyncProd.emit();
    }

    isAllSelected() {
        return this.selection.selected.length === this.dataSource.data.length;
    }

    masterToggle() {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
        this.selectEvent.emit(this.selection.selected);
    }

    handleEdit($event, row) {
        $event.stopPropagation();
        this.editEvent.emit(row);
    }

    handleDelete($event, row) {
        $event.stopPropagation();
        this.deleteEvent.emit(row);
    }

    handleSelect(row) {
        this.selection.toggle(row);
        this.selectEvent.emit(this.selection.selected);
    }

    handleChecked(row) {
        return this.selection.isSelected(row);
    }

    computeAmount(price,qty) {
        return price * qty;
    }

    scrollBottom() {
        // console.log("scrollBottom", this.elem.nativeElement.querySelector('tr.mat-row:last-of-type'))
        if(this.dataSource.data.length>3)
          this.elem.nativeElement.querySelector('tr.mat-row:last-of-type').scrollIntoView();
    }
}
