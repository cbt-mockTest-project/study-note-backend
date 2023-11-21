import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { History } from './entites/history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveHistoryInput, SaveHistoryOutput } from './dtos/saveHistory.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly histories: Repository<History>,
  ) {}
  async saveHistory(
    user: User,
    saveHistoryInput: SaveHistoryInput,
  ): Promise<SaveHistoryOutput> {
    try {
      const { studySetting } = saveHistoryInput;
      const history = await this.histories.findOne({
        where: { user: { id: user.id } },
      });
      if (!history) {
        await this.histories.save(
          this.histories.create({
            user,
            studySettings: [studySetting],
          }),
        );
        return {
          ok: true,
        };
      }
      const existedIndex = history.studySettings.findIndex(
        (s) => s.folderId === studySetting.folderId,
      );
      if (existedIndex > -1) {
        history.studySettings = history.studySettings.map((s, index) => {
          if (index === existedIndex) {
            return studySetting;
          }
          return s;
        });
      } else {
        history.studySettings.push(studySetting);
      }
      await this.histories.save(history);

      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '히스토리를 저장하는데 실패했습니다.',
      };
    }
  }
}
