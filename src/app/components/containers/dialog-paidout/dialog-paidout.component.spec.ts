import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaidoutComponent } from './dialog-paidout.component';

describe('DialogPaidoutComponent', () => {
  let component: DialogPaidoutComponent;
  let fixture: ComponentFixture<DialogPaidoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPaidoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPaidoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
