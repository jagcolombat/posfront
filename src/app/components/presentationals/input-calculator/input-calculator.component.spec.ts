import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCalculatorComponent } from './input-calculator.component';

describe('InputCalculatorComponent', () => {
  let component: InputCalculatorComponent;
  let fixture: ComponentFixture<InputCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
