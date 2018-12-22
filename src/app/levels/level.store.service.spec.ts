import { TestBed } from '@angular/core/testing';

import { Level.StoreService } from './level.store.service';

describe('Level.StoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Level.StoreService = TestBed.get(Level.StoreService);
    expect(service).toBeTruthy();
  });
});
