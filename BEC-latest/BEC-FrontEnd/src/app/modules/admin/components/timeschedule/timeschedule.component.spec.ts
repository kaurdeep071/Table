import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimescheduleComponent } from './timeschedule.component';

describe('TimescheduleComponent', () => {
  let component: TimescheduleComponent;
  let fixture: ComponentFixture<TimescheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimescheduleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
