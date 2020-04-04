import { Test, TestingModule } from '@nestjs/testing';
import { FreezerService } from './freezer.service';

describe('FreezerService', () => {
  let service: FreezerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreezerService],
    }).compile();

    service = module.get<FreezerService>(FreezerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
