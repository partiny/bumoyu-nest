import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MailService } from "./mail.service";
import { ApiResult } from "@src/core/filters";
import { Public } from "@src/utils";
import { MailDto } from "./mail.dto";

@ApiTags('邮件')
@Controller('mail')
export default class MailController {
  constructor(
    private readonly mailService: MailService
  ) {}

  apiResult = new ApiResult()

  @Public()
  @Post('send-verification-code')
  @ApiOperation({ summary: '发送邮箱验证码' })
  async sendVerificationCode(@Body() dto: MailDto) {
    await this.mailService.sendVerificationCode(dto)
    return this.apiResult.message()
  }
}