import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationOfIllnessComponent } from './notification-of-illness.component';

describe('NotificationOfIllnessComponent', () => {
  let component: NotificationOfIllnessComponent;
  let fixture: ComponentFixture<NotificationOfIllnessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationOfIllnessComponent]
    });
    fixture = TestBed.createComponent(NotificationOfIllnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
