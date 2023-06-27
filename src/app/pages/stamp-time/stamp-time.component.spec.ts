import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampTimeComponent } from './stamp-time.component';

describe('StampTimeComponent', () => {
  let component: StampTimeComponent;
  let fixture: ComponentFixture<StampTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StampTimeComponent]
    });
    fixture = TestBed.createComponent(StampTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
