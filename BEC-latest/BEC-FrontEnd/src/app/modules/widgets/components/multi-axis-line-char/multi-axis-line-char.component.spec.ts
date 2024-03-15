import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAxisLineCharComponent } from './multi-axis-line-char.component';

describe('MultiAxisLineCharComponent', () => {
  let component: MultiAxisLineCharComponent;
  let fixture: ComponentFixture<MultiAxisLineCharComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiAxisLineCharComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiAxisLineCharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
