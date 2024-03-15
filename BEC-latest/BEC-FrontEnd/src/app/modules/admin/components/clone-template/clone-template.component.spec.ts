import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneTemplateComponent } from './clone-template.component';

describe('CloneTemplateComponent', () => {
  let component: CloneTemplateComponent;
  let fixture: ComponentFixture<CloneTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloneTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
