import { CoreEntity } from 'src/common/entities/core.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class FolderEditAccess extends CoreEntity {
  @ManyToOne(() => User, (user) => user.folderEditAccesses, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.folderEditAccesses, {
    onDelete: 'CASCADE',
  })
  folder: Folder;
}
