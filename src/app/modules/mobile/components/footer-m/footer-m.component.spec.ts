import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterMComponent } from './footer-m.component';

describe('FooterMComponent', () => {
  let component: FooterMComponent;
  let fixture: ComponentFixture<FooterMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
