import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMComponent } from './plan-m.component';

describe('PlanMComponent', () => {
  let component: PlanMComponent;
  let fixture: ComponentFixture<PlanMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
