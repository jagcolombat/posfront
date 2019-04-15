import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSalesComponent } from './generic-sales.component';

describe('GenericSalesComponent', () => {
  let component: GenericSalesComponent;
  let fixture: ComponentFixture<GenericSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
