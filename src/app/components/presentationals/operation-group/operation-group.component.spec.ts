import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationGroupComponent } from './operation-group.component';

describe('OperationGroupComponent', () => {
  let component: OperationGroupComponent;
  let fixture: ComponentFixture<OperationGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
