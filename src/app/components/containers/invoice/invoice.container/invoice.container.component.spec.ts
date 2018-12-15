import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Invoice.ContainerComponent } from './invoice.container.component';

describe('Invoice.ContainerComponent', () => {
  let component: Invoice.ContainerComponent;
  let fixture: ComponentFixture<Invoice.ContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Invoice.ContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Invoice.ContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
