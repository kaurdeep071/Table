import { TestBed } from '@angular/core/testing';

import { ScopeOfWorkService } from './scope-of-work.service';

describe('ScopeOfWorkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScopeOfWorkService = TestBed.get(ScopeOfWorkService);
    expect(service).toBeTruthy();
  });
});
