import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MailDto } from "./mail.dto";
import { RedisService } from "../redis/redis.service";
import * as path from 'path'
import { EMAIL_TEMPLATE } from "./template/template.enum";

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private redisService: RedisService
  ) {}

  /**发送邮件验证码 */
  async sendVerificationCode(dto: MailDto) {
    const { email } = dto
    const code = await this.generateVerificationCode(dto)
    await this.sendVerificationEmail(email, code, dto.type)
  }

  /**生成验证码 */
  async generateVerificationCode(dto: MailDto) {
    const { email, type } = dto
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6位数验证码
    const expiresInSeconds = 15 * 60 // 验证码有效期为60秒
    
    await this.redisService.set(`${type}_verification:${email}`, code, expiresInSeconds)
    
    return code
  }

  /**发送包含注册验证码的邮件 */
  async sendVerificationEmail(
    email: string,
    code: string,
    type: EMAIL_TEMPLATE = EMAIL_TEMPLATE.registAccount
  ): Promise<void> {
    let subjectName = '注册验证码'
    const templateDir = `${type}.hbs`
    switch(type) {
      // 注册账号
      case EMAIL_TEMPLATE.registAccount:
        subjectName = '注册验证码'
        break
      case EMAIL_TEMPLATE.resetPassword:
        subjectName = '重置密码验证码'
        break
    }

    // 使用相对于项目根目录的路径
    const templatePath = path.join(
      process.cwd(),
      process.env.NODE_ENV === 'production' ? 'dist' : 'src',
      'modules',
      'common',
      'mail',
      'template',
      templateDir
    );
    const options = {
      to: email,
      subject: subjectName,
      template: templatePath,
      context: {
        code
      }
    }
    console.log(`Sending ${type} email with options:`, JSON.stringify(options, null, 2));
    try {
      await this.mailerService.sendMail(options);
      console.log('Verification email sent successfully.');
    } catch (error) {
      console.error(`Failed to send ${type} email:`, error);
      throw new InternalServerErrorException('发送验证码失败');
    }
  }
}