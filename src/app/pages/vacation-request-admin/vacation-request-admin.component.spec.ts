import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationRequestAdminComponent } from './vacation-request-admin.component';

describe('VacationRequestAdminComponent', () => {
  let component: VacationRequestAdminComponent;
  let fixture: ComponentFixture<VacationRequestAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VacationRequestAdminComponent]
    });
    fixture = TestBed.createComponent(VacationRequestAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
