import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SOPComponent } from './sop.component';

describe('SOPComponent', () => {
  let component: SOPComponent;
  let fixture: ComponentFixture<SOPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SOPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SOPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
