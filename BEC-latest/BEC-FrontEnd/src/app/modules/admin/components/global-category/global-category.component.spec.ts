import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCategoryComponent } from './global-category.component';

describe('GlobalCategoryComponent', () => {
  let component: GlobalCategoryComponent;
  let fixture: ComponentFixture<GlobalCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
