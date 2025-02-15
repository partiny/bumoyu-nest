import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RefreshTokenDto, ResetPasswordDto, SignInDto, SignUpDto } from "./auth.dto";
import { Public } from "@src/utils";
import { ApiResult } from "@src/core/filters";
import { MailDto } from "../mail/mail.dto";
import { EMAIL_TEMPLATE } from "../mail/template/template.enum";

@ApiTags('权限')
@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  apiResult = new ApiResult()

  @Public()
  @Post('sign-in')
  @ApiOperation({ summary: '登录' })
  async SignIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto)
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: '注册' })
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto)
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: '刷新token' })
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken)
  }

  @Get('check')
  @ApiOperation({ summary: '校验token状态' })
  async check() {
    return this.apiResult.message()
  }

  @Post('proxy')
  @Public()
  @ApiOperation({ summary: '跨域转发接口' })
  async proxy(@Body() { url }: {url: string}) {
    return await this.authService.proxy(url)
  }

  @Post('send-email-code-of-regist-account')
  @Public()
  @ApiOperation({ summary: '注册时发送邮箱验证码' })
  async sendEmailCodeOfRegistAccount(@Body() dto: MailDto) {
    dto.type = EMAIL_TEMPLATE.registAccount
    return await this.authService.sendEmailVerificationCode(dto)
  }

  @Post('send-email-code-of-reset-password')
  @Public()
  @ApiOperation({ summary: '重置密码时发送邮箱验证码' })
  async sendEmailCodeOfResetPassword(@Body() dto: MailDto) {
    dto.type = EMAIL_TEMPLATE.resetPassword
    return await this.authService.sendEmailVerificationCode(dto)
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: '重置密码' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto)
  }
}