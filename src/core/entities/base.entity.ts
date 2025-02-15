import { Transform } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string // 主键，uuid，自动生成

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    // select: false
  })
  createTime: string

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    select: false
  })
  @Transform(({ value }) => new Date(value), { toPlainOnly: true })
  updateTime: string

  @Column({
    type: 'varchar',
    nullable: true,
    comment: '最后一次更新记录的用户id'
  })
  updatedBy: number
}