import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches } from "class-validator"

export class RoleDto {
  @ApiProperty({ description: '角色编码', example: 'admin' })
  @Matches(/^[a-zA-Z0-9]+$/, { message: '角色编码只能输入字母或数字' })
  @Length(4, 20, { each: true, message: '角色编码可输入长度为 4-20' })
  @IsString({ message: '角色编码只能为字符串类型' })
  @IsNotEmpty({ message: '角色编码不能为空' })
  roleCode: string

  @ApiProperty({ description: '角色名称', example: '管理员' })
  @Matches(/^[a-zA-Z0-9_\u4e00-\u9fa5-]+$/, { message: '角色名称只能输入中文、字母、数字或 _、- 等字符' })
  @Length(1, 30, { each: true, message: '角色名称可输入长度为 1-30' })
  @IsString({ message: '角色名称只能为字符串类型' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  roleName: string
}

export class AddRoleDto extends RoleDto {}

export class UpdateRoleDto extends RoleDto {
  @ApiProperty({ description: '角色id', example: 'xxxx-xxxx-xxxx-xxxx', type: 'string', required: true })
  @IsNotEmpty({ message: '角色id不能为空' })
  id: string
}

export class DeleteRoleDto extends UpdateRoleDto {}

export class GetRoleListDto {
  @ApiPropertyOptional({ description: '页码', example: 1, type: 'integer', default: 1 })
  @IsNumber(undefined, { message: 'pageNum 只能输入数字类型' })
  @IsOptional()
  pageNum: number

  @ApiPropertyOptional({ description: '每页数量', example: 10, type: 'integer', default: 10 })
  @IsNumber(undefined, { message: 'pageSize 只能输入数字类型' })
  @IsOptional()
  pageSize: number
}
