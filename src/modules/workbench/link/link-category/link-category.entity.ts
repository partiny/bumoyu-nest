import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '@src/modules/system/user/user.entity';
import { Base } from '@src/core/entities/base.entity';
import { Link } from '../link-list/link.entity';

@Entity()
export class LinkCategory extends Base {
  @Column({ type: 'varchar', length: 50, nullable: false, comment: '链接分类名称' })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '链接分类icon，url或短码' })
  icon: string;

  @ManyToOne(() => User, user => user.linkCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', name: 'userId', nullable: false })
  userId: string;

  @OneToMany(() => Link, link => link.category)
  links: Link[];

  @Column({ type: 'int', nullable: true, comment: '排序' })
  sort: number;
}