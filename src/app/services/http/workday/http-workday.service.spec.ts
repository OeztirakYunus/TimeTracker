import { TestBed } from '@angular/core/testing';

import { HttpWorkdayService } from './http-workday.service';

describe('HttpWorkdayService', () => {
  let service: HttpWorkdayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpWorkdayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
