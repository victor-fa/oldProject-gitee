import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMComponent } from './about-m.component';

describe('AboutMComponent', () => {
  let component: AboutMComponent;
  let fixture: ComponentFixture<AboutMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
