import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondsPage } from './diamonds.page';

describe('DiamondsPage', () => {
  let component: DiamondsPage;
  let fixture: ComponentFixture<DiamondsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiamondsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiamondsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
