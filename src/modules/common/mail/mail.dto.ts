import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { EMAIL_TEMPLATE } from "./template/template.enum";

export class MailDto {
  @ApiProperty({ description: '邮箱', example: 'abc@def.com' })
  @IsEmail(undefined, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string

  @ApiProperty({ description: '模板类型', example: 'regist-account' })
  @IsOptional()
  type: EMAIL_TEMPLATE
}
