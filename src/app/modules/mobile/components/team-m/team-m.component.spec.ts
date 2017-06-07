import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMComponent } from './team-m.component';

describe('TeamMComponent', () => {
  let component: TeamMComponent;
  let fixture: ComponentFixture<TeamMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
