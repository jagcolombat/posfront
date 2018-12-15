import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashViewComponent } from './cash-view.component';

describe('CashViewComponent', () => {
  let component: CashViewComponent;
  let fixture: ComponentFixture<CashViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
