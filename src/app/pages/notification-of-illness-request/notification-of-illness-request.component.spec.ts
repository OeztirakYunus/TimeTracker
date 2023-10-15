import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationOfIllnessRequestComponent } from './notification-of-illness-request.component';

describe('NotificationOfIllnessRequestComponent', () => {
  let component: NotificationOfIllnessRequestComponent;
  let fixture: ComponentFixture<NotificationOfIllnessRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationOfIllnessRequestComponent]
    });
    fixture = TestBed.createComponent(NotificationOfIllnessRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
