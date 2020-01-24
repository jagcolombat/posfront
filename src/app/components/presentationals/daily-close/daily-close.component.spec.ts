import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCloseComponent } from './daily-close.component';

describe('DailyCloseComponent', () => {
  let component: DailyCloseComponent;
  let fixture: ComponentFixture<DailyCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
