import { Base } from "@src/core/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { User } from "../user/user.entity";

@Entity('role')
export class Role extends Base {
  @Column({ type: 'varchar', length: 50, unique: true, comment: '角色名称' })
  roleName: string

  @Column({ type: 'varchar', length: 50, unique: true, comment: '角色编码' })
  roleCode: string

  // 反向关系字段
  @OneToMany(() => User, user => user.role)
  users: User[]
}