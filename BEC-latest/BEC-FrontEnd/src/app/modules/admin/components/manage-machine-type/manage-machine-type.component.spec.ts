import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMachineTypeComponent } from './manage-machine-type.component';

describe('ManageMachineTypeComponent', () => {
  let component: ManageMachineTypeComponent;
  let fixture: ComponentFixture<ManageMachineTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMachineTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMachineTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
