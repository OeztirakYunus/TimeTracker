import { TestBed } from '@angular/core/testing';

import { HttpNoiService } from './http-noi.service';

describe('HttpNoiService', () => {
  let service: HttpNoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpNoiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
