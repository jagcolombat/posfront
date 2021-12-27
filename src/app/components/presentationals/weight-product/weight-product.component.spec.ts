import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightProductComponent } from './weight-product.component';

describe('WeightProductComponent', () => {
  let component: WeightProductComponent;
  let fixture: ComponentFixture<WeightProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
