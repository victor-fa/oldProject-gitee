import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMComponent } from './contact-m.component';

describe('ContactMComponent', () => {
  let component: ContactMComponent;
  let fixture: ComponentFixture<ContactMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
