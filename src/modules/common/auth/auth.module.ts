import { forwardRef, Module } from "@nestjs/common";
import AuthController from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/modules/system/user/user.entity";
import { Role } from "@src/modules/system/role/role.entity";
import { MailModule } from "../mail/mail.module";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    forwardRef(() => MailModule), // 在相互依赖的模块中使用 forwardRef() 来延迟模块的解析
    RedisModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}