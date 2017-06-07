import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMComponent } from './partner-m.component';

describe('PartnerMComponent', () => {
  let component: PartnerMComponent;
  let fixture: ComponentFixture<PartnerMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
