import { ApiProperty } from "@nestjs/swagger";

export class PaginationResponseDto<T> {
  @ApiProperty({ description: '页码', default: 1 })
  pageNum: number

  @ApiProperty({ description: '每页数量', default: 10 })
  pageSize: number

  @ApiProperty({ description: '总条数', default: 0 })
  total: number

  @ApiProperty({ description: '列表', isArray: true })
  list: T[]
}