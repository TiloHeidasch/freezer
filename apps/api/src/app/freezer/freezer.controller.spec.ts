import { Test, TestingModule } from '@nestjs/testing';
import { FreezerController } from './freezer.controller';

describe('Freezer Controller', () => {
  let controller: FreezerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreezerController],
    }).compile();

    controller = module.get<FreezerController>(FreezerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
