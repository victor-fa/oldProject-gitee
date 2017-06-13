import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMComponent } from './nav-m.component';

describe('NavMComponent', () => {
  let component: NavMComponent;
  let fixture: ComponentFixture<NavMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
