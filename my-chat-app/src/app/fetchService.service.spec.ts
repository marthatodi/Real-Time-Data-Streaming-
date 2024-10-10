import { TestBed } from '@angular/core/testing';
import { FetchingService } from './fetchService.service';

describe('OpenaiService', () => {
  let service: FetchingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
