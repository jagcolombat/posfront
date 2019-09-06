import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCcComponent } from './input-cc.component';

describe('InputCcComponent', () => {
  let component: InputCcComponent;
  let fixture: ComponentFixture<InputCcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputCcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
