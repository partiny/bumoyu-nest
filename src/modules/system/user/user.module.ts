import { Module } from "@nestjs/common";
import UserController from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Role } from "../role/role.entity";
import { Todo } from "@src/modules/workbench/todo/todo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Todo])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}