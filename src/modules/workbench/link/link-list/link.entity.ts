import { Entity, Column,ManyToOne,JoinColumn } from 'typeorm';
import { LinkCategory } from '../link-category/link-category.entity';
import { Base } from '@src/core/entities/base.entity';

@Entity('link')
export class Link extends Base {
  @Column({ type: 'varchar', length: 100, nullable: false, comment: '链接名称' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '链接地址' })
  url: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: 'icon背景图地址' })
  src: string;

  @Column({ type: 'varchar', length: 10, nullable: false, default: 'text', comment: '链接icon类型 text | icon | component' })
  type: 'text' | 'icon' | 'component';

  @Column({ type: 'int', nullable: true, comment: '未定义属性' })
  view: number;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: 'icon背景颜色值' })
  backgroundColor: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '链接简称' })
  iconText: string;

  @ManyToOne(() => LinkCategory, category => category.links, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: LinkCategory;

  @Column({ type: 'varchar', name: 'categoryId', nullable: false, comment: '链接分类id' })
  categoryId: string;

  @Column({ type: 'int', nullable: true, comment: '排序' })
  sort: number;
}