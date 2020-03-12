import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivemaintenanceComponent } from './preventivemaintenance.component';

describe('PreventivemaintenanceComponent', () => {
  let component: PreventivemaintenanceComponent;
  let fixture: ComponentFixture<PreventivemaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventivemaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventivemaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
