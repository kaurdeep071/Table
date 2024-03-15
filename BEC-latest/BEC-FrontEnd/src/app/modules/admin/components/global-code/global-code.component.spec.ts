import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCodeComponent } from './global-code.component';

describe('GlobalCodeComponent', () => {
  let component: GlobalCodeComponent;
  let fixture: ComponentFixture<GlobalCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
