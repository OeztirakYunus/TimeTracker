import { TestBed } from '@angular/core/testing';

import { HttpCompanyService } from './http-company.service';

describe('HttpCompanyService', () => {
  let service: HttpCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
