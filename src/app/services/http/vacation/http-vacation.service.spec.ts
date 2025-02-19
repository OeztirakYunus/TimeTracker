import { TestBed } from '@angular/core/testing';

import { HttpVacationService } from './http-vacation.service';

describe('HttpVacationService', () => {
  let service: HttpVacationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpVacationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
