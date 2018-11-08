import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOpsComponent } from './payment-ops.component';

describe('PaymentOpsComponent', () => {
  let component: PaymentOpsComponent;
  let fixture: ComponentFixture<PaymentOpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentOpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
