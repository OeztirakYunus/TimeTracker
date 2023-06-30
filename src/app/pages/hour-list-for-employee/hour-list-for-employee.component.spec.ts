import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourListForEmployeeComponent } from './hour-list-for-employee.component';

describe('HourListForEmployeeComponent', () => {
  let component: HourListForEmployeeComponent;
  let fixture: ComponentFixture<HourListForEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HourListForEmployeeComponent]
    });
    fixture = TestBed.createComponent(HourListForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
