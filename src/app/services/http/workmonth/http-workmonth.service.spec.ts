import { TestBed } from '@angular/core/testing';

import { HttpWorkmonthService } from './http-workmonth.service';

describe('HttpWorkmonthService', () => {
  let service: HttpWorkmonthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpWorkmonthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
