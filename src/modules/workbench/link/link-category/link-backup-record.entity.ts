import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('link_backup_record')
export class LinkBackupRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string // 主键，uuid，自动生成
  
  @CreateDateColumn({
    type: 'timestamp',
    comment: '备份时间'
  })
  createTime: string

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '备份类型（新增、修改、删除、手动备份、自动备份）'
  })
  type: 'create' | 'update' | 'delete' | 'manual' | 'auto'

  @Column({
    type: 'json',
    nullable: false,
    comment: '备份数据（所有分类及分类下的链接）'
  })
  data: unknown

  @Column({
    type: 'varchar',
    name: 'userId',
    nullable: false,
    comment: '用户id'
  })
  userId: string
}