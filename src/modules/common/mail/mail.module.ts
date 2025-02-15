import { Module } from "@nestjs/common";
import MailController from "./mail.controller";
import { MailService } from "./mail.service";
import { RedisModule } from "../redis/redis.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path'

@Module({
  imports: [
    RedisModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'), // SMTP服务器的端口号，不同的邮件服务商和协议有不同的默认端口（例如：25, 465, 587）
          secure: true, // 表示是否启用安全连接，比如SSL/TLS。如果使用的是465端口，则通常需要设置为true；否则一般设置为false
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS')
          }
        },
        defaults: {
          from: config.get<string>('MAIL_FROM') // 设置默认的发件人地址，这样每次发送邮件时不需要每次都指定发件人
        },
        template: {
          dir: path.join(__dirname, '.', 'template'), // 使用绝对路径指向模板目录
          adapter: new HandlebarsAdapter(), // 指定 Handlebars 引擎适配器
          options: {
            strict: true
          }
        }
      })
    })
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}