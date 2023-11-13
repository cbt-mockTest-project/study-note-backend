import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { StudyCard } from 'src/study-card/entities/study-card.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class StudyNote extends CoreEntity {
  @Column()
  @IsString()
  name: string;

  @Column({ type: 'json', default: [] })
  studyCardOrder: number[];

  @ManyToOne(() => User, (user) => user.studyNotes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToMany(() => Folder, (folder) => folder.studyNotes)
  folders: Folder[];

  @OneToMany(() => StudyCard, (studyCard) => studyCard.studyNote)
  studyCards: StudyCard[];
}
