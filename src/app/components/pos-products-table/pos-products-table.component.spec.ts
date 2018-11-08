import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosProductsTableComponent } from './pos-products-table.component';

describe('PosProductsTableComponent', () => {
    let component: PosProductsTableComponent;
    let fixture: ComponentFixture<PosProductsTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PosProductsTableComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PosProductsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
