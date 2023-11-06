import { Test, TestingModule } from '@nestjs/testing';
import { StudyNoteController } from './study-note.controller';

describe('StudyNoteController', () => {
  let controller: StudyNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyNoteController],
    }).compile();

    controller = module.get<StudyNoteController>(StudyNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
