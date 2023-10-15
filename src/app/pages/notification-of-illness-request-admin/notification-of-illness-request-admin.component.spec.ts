import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationOfIllnessRequestAdminComponent } from './notification-of-illness-request-admin.component';

describe('NotificationOfIllnessRequestAdminComponent', () => {
  let component: NotificationOfIllnessRequestAdminComponent;
  let fixture: ComponentFixture<NotificationOfIllnessRequestAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationOfIllnessRequestAdminComponent]
    });
    fixture = TestBed.createComponent(NotificationOfIllnessRequestAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
