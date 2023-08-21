import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationRequestComponent } from './vacation-request.component';

describe('VacationRequestComponent', () => {
  let component: VacationRequestComponent;
  let fixture: ComponentFixture<VacationRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VacationRequestComponent]
    });
    fixture = TestBed.createComponent(VacationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
