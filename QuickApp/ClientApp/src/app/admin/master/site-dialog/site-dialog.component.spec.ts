import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteDialogComponent } from './site-dialog.component';

describe('SiteDialogComponent', () => {
  let component: SiteDialogComponent;
  let fixture: ComponentFixture<SiteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
