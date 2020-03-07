import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDateComponent } from './set-date.component';

describe('SetDateComponent', () => {
  let component: SetDateComponent;
  let fixture: ComponentFixture<SetDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
