import { CoreEntity } from 'src/common/entities/core.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class FolderReadAccess extends CoreEntity {
  @ManyToOne(() => User, (user) => user.folderReadAccesses, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.folderReadAccesses, {
    onDelete: 'CASCADE',
  })
  folder: Folder;
}
