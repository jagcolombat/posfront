import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialOpComponent } from './financial-op.component';

describe('FinancialOpComponent', () => {
  let component: FinancialOpComponent;
  let fixture: ComponentFixture<FinancialOpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialOpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
