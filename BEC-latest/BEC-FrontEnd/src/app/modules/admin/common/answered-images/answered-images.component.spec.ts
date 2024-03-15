import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnsweredImagesComponent } from './answered-images.component';

describe('AnsweredImagesComponent', () => {
  let component: AnsweredImagesComponent;
  let fixture: ComponentFixture<AnsweredImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnsweredImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnsweredImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
