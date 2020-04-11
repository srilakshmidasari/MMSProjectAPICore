import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmOrderComponent } from './pm-order.component';

describe('PmOrderComponent', () => {
  let component: PmOrderComponent;
  let fixture: ComponentFixture<PmOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
