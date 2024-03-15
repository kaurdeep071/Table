import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianproductivepointComponent } from './technicianproductivepoint.component';

describe('TechnicianproductivepointComponent', () => {
  let component: TechnicianproductivepointComponent;
  let fixture: ComponentFixture<TechnicianproductivepointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicianproductivepointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianproductivepointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
