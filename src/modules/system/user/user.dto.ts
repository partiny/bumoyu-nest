import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger"
import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, ValidateIf } from "class-validator"

export class UserDto {
  // 每个字段的校验是从下往上进行的
  @ApiProperty({ description: '用户名', example: 'zhang3' })
  @Matches(/[a-zA-z0-9_-]+$/, { message: '用户名只能输入字母、数字或 _、- 等字符' })
  @Length(5, 30, { each: true, message: '用户名可输入长度为 5-30' })
  @IsString({ message: '用户名只能为字符串类型' })
  @IsNotEmpty({  message: '用户名不能为空' })
  userName: string

  @ApiProperty({ description: '密码', example: '123456' })
  @Length(5, 50, { each: true, message: '密码可输入长度为 5-50' })
  @IsString({ message: '密码只能为字符串类型' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string

  // 每个字段的校验是从下往上进行的
  @ApiProperty({ description: '昵称', example: '张三' })
  @Matches(/^[a-zA-Z0-9_\u4e00-\u9fa5-]+$/, { message: '昵称只能输入中文、字母、数字或 _、- 等字符' })
  @Length(1, 30, { each: true, message: '昵称可输入长度为 1-30' })
  @ValidateIf((object, value) => ![null, undefined, ''].includes(value))
  @IsOptional()
  nickName: string

  @ApiProperty({ description: '邮箱', example: 'abc@def.com' })
  @IsEmail(undefined, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string

  @ApiProperty({ description: '手机号', example: '13344445555' })
  @Matches(/^1\d{10}$/, { message: '手机号格式不正确' })
  @ValidateIf((object, value) => ![null, undefined, ''].includes(value))
  @IsOptional()
  phone: string

  @ApiProperty({ description: '状态 1启用 0停用，默认1', example: 1, default: 1 })
  @IsIn([0, 1], { message: '状态值只能为 0 或 1' })
  @ValidateIf((object, value) => ![null, undefined, ''].includes(value))
  @IsOptional()
  status: number

  @ApiProperty({ description: '来源', example: 'PC' })
  @IsOptional()
  source: string
}

export class AddUserDto extends PartialType(UserDto) {}

export class UpdateUserDto extends PartialType(UserDto) {
  @ApiProperty({ description: '用户id', example: 123, type: 'string', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: string
}

export class UpdateUserStatusDto {
  @ApiProperty({ description: '用户id', example: 123, type: 'string', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: string

  @ApiProperty({ description: '状态', example: 1, type: 'integer', required: true, default: 1 })
  @IsIn([0, 1], { message: '状态值只能为 0 或 1' })
  @IsNotEmpty({ message: '状态不能为空' })
  status: number
}

export class DeleteUserDto extends UpdateUserDto {}

export class GetUserListDto {
  @ApiPropertyOptional({ description: '用户名', example: 'zhang3' })
  @IsOptional()
  userName: string

  @ApiPropertyOptional({ description: '页码', example: 1, type: 'integer', default: 1 })
  @IsNumber(undefined, { message: 'pageNum 只能输入数字类型' })
  @IsOptional()
  pageNum: number

  @ApiPropertyOptional({ description: '每页数量', example: 10, type: 'integer', default: 10 })
  @IsNumber(undefined, { message: 'pageSize 只能输入数字类型' })
  @IsOptional()
  pageSize: number
  
  @ApiPropertyOptional({ description: '邮箱', example: 'abc@def.com' })
  @IsOptional()
  email: string
}

export class GetUserInfoByIdDto {
  @ApiProperty({ description: '用户id', example: 123, type: 'string', required: true  })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: string
}

export class AssignRoleToUserDto {
  @ApiProperty({ description: '用户id', example: 123, type: 'string', required: true  })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: string;

  @ApiProperty({ description: '角色id', example: 1, type: 'string', required: true  })
  @IsNotEmpty({ message: '角色id不能为空' })
  roleId: string;
}