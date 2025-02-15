import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupService } from './backup.service';
import { Backup } from './backup.entity';
import { LinkCategory } from '../link/link-category/link-category.entity'; 
import { Link } from '../link/link-list/link.entity'; 
import { User } from '@src/modules/system/user/user.entity';
import { BackupController } from './backup.controller';
import { LinkModule } from '../link/link-list/link.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Backup, LinkCategory, Link, User]),
    forwardRef(() => LinkModule) // 在相互依赖的模块中使用 forwardRef() 来延迟模块的解析
  ],
  controllers: [BackupController],
  providers: [BackupService],
  exports: [BackupService] // 导出后以便在别的模块调用service中的方法
})
export class BackupModule {}