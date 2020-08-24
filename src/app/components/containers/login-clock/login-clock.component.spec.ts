import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginClockComponent } from './login-clock.component';

describe('LoginClockComponent', () => {
  let component: LoginClockComponent;
  let fixture: ComponentFixture<LoginClockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginClockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
