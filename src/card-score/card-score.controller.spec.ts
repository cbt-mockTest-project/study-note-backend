import { Test, TestingModule } from '@nestjs/testing';
import { CardScoreController } from './card-score.controller';

describe('CardScoreController', () => {
  let controller: CardScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardScoreController],
    }).compile();

    controller = module.get<CardScoreController>(CardScoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
