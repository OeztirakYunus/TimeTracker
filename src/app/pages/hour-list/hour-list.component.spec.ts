import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourListComponent } from './hour-list.component';

describe('HourListComponent', () => {
  let component: HourListComponent;
  let fixture: ComponentFixture<HourListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HourListComponent]
    });
    fixture = TestBed.createComponent(HourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
