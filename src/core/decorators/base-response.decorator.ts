import { ApiProperty } from "@nestjs/swagger"

export class BaseResponseDto<T> {
  @ApiProperty({ description: '状态码 0成功 其它失败' })
  code: number

  @ApiProperty({ description: '请求是否成功', example: true })
  success: boolean

  @ApiProperty({ description: '成功/错误信息', example: '请求成功' })
  message: string

  @ApiProperty({ description: '请求时间' })
  timestamp: string

  @ApiProperty({ description: '请求结果' })
  data: T
}