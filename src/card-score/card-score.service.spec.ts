import { Test, TestingModule } from '@nestjs/testing';
import { CardScoreService } from './card-score.service';

describe('CardScoreService', () => {
  let service: CardScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardScoreService],
    }).compile();

    service = module.get<CardScoreService>(CardScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
