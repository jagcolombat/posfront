import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericInfoModalComponent } from './generic-info-modal.component';

describe('GenericInfoModalComponent', () => {
  let component: GenericInfoModalComponent;
  let fixture: ComponentFixture<GenericInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
