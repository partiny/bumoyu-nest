import { PickType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { UserDto } from "@src/modules/system/user/user.dto";

export class RefreshTokenDto {
  @ApiProperty({ description: '刷新token' })
  @IsNotEmpty({
    message: 'refreshToken不能为空'
  })
  refreshToken: string
}

export class SignInDto extends PickType(
  UserDto,
  ['userName', 'password']
) {
  @ApiProperty({ description: '用户名', example: 'zhang3' })
  userName: string

  @ApiProperty({ description: '密码', example: '123456' })
  password: string
}
/**注册账号Dto */
export class SignUpDto extends PickType(
  UserDto,
  ['userName', 'password', 'email', 'source']
) {
  @ApiProperty({ description: '用户名', example: 'zhang3', required: true })
  userName: string

  @ApiProperty({ description: '密码', example: '123456' })
  password: string

  @ApiProperty({ description: '邮箱', example: 'abc@def.com' })
  email: string

  @IsOptional()
  source: string

  @ApiProperty({ description: '邮箱验证码', example: '123456' })
  verificationCode: string
}
/**重置密码Dto */
export class ResetPasswordDto {
  @ApiProperty({ description: '密码', example: '123456' })
  password: string

  @ApiProperty({ description: '邮箱', example: 'abc@def.com' })
  email: string

  @ApiProperty({ description: '邮箱验证码', example: '123456' })
  verificationCode: string
}