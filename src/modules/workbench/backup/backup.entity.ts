import { Base } from "@src/core/entities/base.entity";
import { User } from "@src/modules/system/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { LinkTreeDto } from "../link/tool";

export const backupType = {
  'link-category-create': '新增链接分类',
  'link-category-update': '修改链接分类',
  'link-category-delete': '删除链接分类',
  'link-create': '新增链接',
  'link-update': '修改链接',
  'link-delete': '删除链接',
  'manual': '手动备份',
  'link-import-add': '批量导入-追加',
  'link-import-cover': '批量导入-覆盖',
}
export type BackupType = keyof typeof backupType

@Entity()
export class Backup extends Base {
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '备份类型（新增、修改、删除、手动备份、自动备份）'
  })
  type: BackupType

  @ManyToOne(
    () => User, user => user.backups,
    {
      onDelete: 'CASCADE',
      eager: true // 会让 TypeORM 在查询 Backup 实体时自动加载相关的 User 实体
    }
  )
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({
    type: 'varchar',
    name: 'userId',
    nullable: false,
    comment: '用户id'
  })
  userId: string

  @Column({
    type: 'json',
    nullable: false,
    comment: '备份数据'
  })
  data: { navConfig: LinkTreeDto[] }
}