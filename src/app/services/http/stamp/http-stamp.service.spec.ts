import { TestBed } from '@angular/core/testing';

import { HttpStampService } from './http-stamp.service';

describe('HttpStampService', () => {
  let service: HttpStampService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpStampService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
