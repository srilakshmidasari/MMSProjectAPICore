import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteLocationComponent } from './site-location.component';

describe('SiteLocationComponent', () => {
  let component: SiteLocationComponent;
  let fixture: ComponentFixture<SiteLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
