import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecperformanceComponent } from './becperformance.component';

describe('BecperformanceComponent', () => {
  let component: BecperformanceComponent;
  let fixture: ComponentFixture<BecperformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecperformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecperformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
