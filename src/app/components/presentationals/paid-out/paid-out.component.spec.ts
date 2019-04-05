import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidOutComponent } from './paid-out.component';

describe('PaidOutComponent', () => {
  let component: PaidOutComponent;
  let fixture: ComponentFixture<PaidOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
