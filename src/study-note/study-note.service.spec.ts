import { Test, TestingModule } from '@nestjs/testing';
import { StudyNoteService } from './study-note.service';

describe('StudyNoteService', () => {
  let service: StudyNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyNoteService],
    }).compile();

    service = module.get<StudyNoteService>(StudyNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
