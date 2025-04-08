import { TestBed } from '@angular/core/testing';

import { TradeModalService } from './trade-modal.service';

describe('TradeModalService', () => {
  let service: TradeModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
