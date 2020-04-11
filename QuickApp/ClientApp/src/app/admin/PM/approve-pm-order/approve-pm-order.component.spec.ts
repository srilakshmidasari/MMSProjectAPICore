import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePmOrderComponent } from './approve-pm-order.component';

describe('ApprovePmOrderComponent', () => {
  let component: ApprovePmOrderComponent;
  let fixture: ComponentFixture<ApprovePmOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovePmOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePmOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
