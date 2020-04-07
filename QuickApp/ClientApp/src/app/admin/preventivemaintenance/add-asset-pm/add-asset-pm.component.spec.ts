import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetPmComponent } from './add-asset-pm.component';

describe('AddAssetPmComponent', () => {
  let component: AddAssetPmComponent;
  let fixture: ComponentFixture<AddAssetPmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssetPmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetPmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
