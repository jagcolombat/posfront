import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDptoComponent } from './list-dpto.component';

describe('ListDptoComponent', () => {
  let component: ListDptoComponent;
  let fixture: ComponentFixture<ListDptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
