import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInfoDetailsComponent } from './order-info-details.component';

describe('OrderInfoDetailsComponent', () => {
  let component: OrderInfoDetailsComponent;
  let fixture: ComponentFixture<OrderInfoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderInfoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
