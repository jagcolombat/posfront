import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericKeyboardComponent } from './generic-keyboard.component';

describe('GenericKeyboardComponent', () => {
  let component: GenericKeyboardComponent;
  let fixture: ComponentFixture<GenericKeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericKeyboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
