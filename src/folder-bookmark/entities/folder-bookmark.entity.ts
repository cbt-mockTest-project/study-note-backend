import { CoreEntity } from 'src/common/entities/core.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class FolderBookmark extends CoreEntity {
  @ManyToOne(() => User, (user) => user.folderBookmarks, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.folderBookmarks, {
    onDelete: 'CASCADE',
  })
  folder: Folder;
}
