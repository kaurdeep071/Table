import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInventoryComponent } from './job-inventory.component';

describe('JobInventoryComponent', () => {
  let component: JobInventoryComponent;
  let fixture: ComponentFixture<JobInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
