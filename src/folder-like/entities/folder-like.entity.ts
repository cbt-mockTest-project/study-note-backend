import { CoreEntity } from 'src/common/entities/core.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class FolderLike extends CoreEntity {
  @ManyToOne(() => User, (user) => user.folderLikes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.folderLikes, {
    onDelete: 'CASCADE',
  })
  folder: Folder;
}
