import { TestBed } from '@angular/core/testing';

import { FavouriteCoinsService } from './favourite-coins.service';

describe('FavouriteCoinsService', () => {
  let service: FavouriteCoinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouriteCoinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
