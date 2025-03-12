import { Base } from "@src/core/entities/base.entity";
import { User } from "@src/modules/system/user/user.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";

export enum TodoStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TodoType {
  PERSONAL = 'personal',
  WORK = 'work',
  OTHER = 'other'
}

@Entity()
export class Todo extends Base {
  @Column({ length: 100 })
  title: string;

  @Column({ type: 'enum', enum: TodoType, default: TodoType.PERSONAL })
  type: TodoType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', nullable: true })
  dateTime: Date;

  @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.PENDING })
  status: TodoStatus;

  @Column({ type: 'enum', enum: TodoPriority, default: TodoPriority.MEDIUM })
  priority: TodoPriority;

  @ManyToOne(() => User, user => user.todos, { onDelete: 'CASCADE' })
  user: User;

  @Column({ name: 'userId' })
  @Index() // 为高频查询字段添加索引
  userId: string;

  @Column({
    type: 'tinyint',
    comment: '逻辑删除标志位 1删除 0未删除',
    select: false,
    default: 0
  })
  isDelete: number;
}