import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGenericComponent } from './product-generic.component';

describe('ProductGenericComponent', () => {
  let component: ProductGenericComponent;
  let fixture: ComponentFixture<ProductGenericComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGenericComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
