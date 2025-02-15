import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinkCategoryController } from "../link-category/link-category.controller";
import { LinkController } from "./link.controller";
import { LinkCategoryService } from "../link-category/link-category.service";
import { LinkService } from "./link.service";
import { LinkCategory } from "../link-category/link-category.entity";
import { Link } from "./link.entity";
import { User } from "@src/modules/system/user/user.entity";
import { BackupModule } from "../../backup/backup.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkCategory, Link, User]),
    forwardRef(() => BackupModule) // 在相互依赖的模块中使用 forwardRef() 来延迟模块的解析
  ],
  controllers: [LinkCategoryController, LinkController],
  providers: [LinkCategoryService, LinkService],
  exports: [LinkService] // 导出后以便在别的模块调用service中的方法
})
export class LinkModule {}