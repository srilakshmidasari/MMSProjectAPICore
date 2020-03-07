import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveItemComponent } from './receive-item.component';

describe('ReceiveItemComponent', () => {
  let component: ReceiveItemComponent;
  let fixture: ComponentFixture<ReceiveItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
