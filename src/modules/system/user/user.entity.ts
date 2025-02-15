import { Base } from "@src/core/entities/base.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import * as dayjs from 'dayjs'
import { Role } from "../role/role.entity";
import { LinkCategory } from "@src/modules/workbench/link/link-category/link-category.entity";
import { Backup } from "@src/modules/workbench/backup/backup.entity";

@Entity('user')
export class User extends Base {
  @Column({ type: 'varchar', length: 50, comment: '用户名' })
  userName: string;

  @Column({ type: 'varchar', length: 50, comment: '密码', select: false })
  password: string;

  @Column({ type: 'varchar', nullable: true, length: 50, comment: '昵称' })
  nickName: string;

  @Column({ type: 'varchar', nullable: true, comment: '头像' })
  avatar: string;

  @Column({ type: 'varchar', nullable: true, length: 50, comment: '邮箱', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true, length: 50, comment: '微信号' })
  wechat: string;

  @Column({ type: 'varchar', nullable: true, length: 10, comment: '注册来源' })
  source: string;

  @Column({ type: 'varchar', nullable: true, length: 15, comment: '手机号', unique: true })
  phone: string;

  @Column({
    type: 'bigint', // 存储为 bigint 类型以支持毫秒级精度
    nullable: true,
    comment: '最后一次登录时间'
  })
  lastLogin: number;
  @BeforeInsert()
  setDefaultLastLogin() {
    if (!this.lastLogin) {
      const n = Date.now()
      console.log(n, dayjs(n).format('YYYY-MM-DD HH:mm:ss'))
      this.lastLogin = n;
    }
  }

  @Column({
    type: 'tinyint',
    comment: '启/停用状态 1启用 0停用',
    default: 1
  })
  status: number;

  @Column({
    type: 'tinyint',
    comment: '逻辑删除标志位 1删除 0未删除',
    select: false,
    default: 0
  })
  isDelete: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role

  // 外键字段，用于数据完整性和查询优化
  @Column({ type: 'varchar', nullable: true })
  roleId: string

  @OneToMany(() => LinkCategory, category => category.user)
  linkCategories: LinkCategory[]

  @OneToMany(() => Backup, backup => backup.user)
  backups: Backup
}