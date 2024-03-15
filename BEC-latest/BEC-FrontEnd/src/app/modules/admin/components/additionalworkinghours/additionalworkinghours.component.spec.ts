import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalworkinghoursComponent } from './additionalworkinghours.component';

describe('AdditionalworkinghoursComponent', () => {
  let component: AdditionalworkinghoursComponent;
  let fixture: ComponentFixture<AdditionalworkinghoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalworkinghoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalworkinghoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
