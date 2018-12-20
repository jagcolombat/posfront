import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPosComponent } from './info-pos.component';

describe('InfoPosComponent', () => {
  let component: InfoPosComponent;
  let fixture: ComponentFixture<InfoPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
