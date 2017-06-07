import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMComponent } from './header-m.component';

describe('HeaderMComponent', () => {
  let component: HeaderMComponent;
  let fixture: ComponentFixture<HeaderMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
