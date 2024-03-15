import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalcodeDropdownComponent } from './globalcode-dropdown.component';

describe('GlobalcodecategoryDropdownComponent', () => {
  let component: GlobalcodeDropdownComponent;
  let fixture: ComponentFixture<GlobalcodeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalcodeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalcodeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
