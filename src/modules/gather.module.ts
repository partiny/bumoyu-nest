import { Module } from "@nestjs/common";
import { AuthModule } from "./common/auth/auth.module";
import { UploadModule } from "./common/upload/upload.module";
import { RoleModule } from "./system/role/role.module";
import { UserModule } from "./system/user/user.module";
import { LinkModule } from "./workbench/link/link-list/link.module";
import { FileModule } from "./common/file/file.module";
import { BackupModule } from "./workbench/backup/backup.module";
import { MailModule } from "./common/mail/mail.module";

@Module({
  imports: [
    AuthModule,
    UploadModule,
    RoleModule,
    UserModule,
    LinkModule,
    FileModule,
    BackupModule,
    MailModule
  ]
})
export class GatherModule {}