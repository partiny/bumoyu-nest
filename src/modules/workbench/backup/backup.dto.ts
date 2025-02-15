import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional } from "class-validator"

export class GetBackupListDto {
  @ApiPropertyOptional({ description: '页码', example: 1, type: 'integer', default: 1 })
  @IsNumber(undefined, { message: 'pageNum 只能输入数字类型' })
  @IsOptional()
  pageNum: number

  @ApiPropertyOptional({ description: '每页数量', example: 10, type: 'integer', default: 10 })
  @IsNumber(undefined, { message: 'pageSize 只能输入数字类型' })
  @IsOptional()
  pageSize: number
}