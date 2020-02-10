import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLocationComponent } from './asset-location.component';

describe('AssetLocationComponent', () => {
  let component: AssetLocationComponent;
  let fixture: ComponentFixture<AssetLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
