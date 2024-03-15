import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobhoursComponent } from './jobhours.component';

describe('JobhoursComponent', () => {
  let component: JobhoursComponent;
  let fixture: ComponentFixture<JobhoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobhoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobhoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
