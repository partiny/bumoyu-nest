import { Injectable } from "@nestjs/common";
import { BaseResponseDto } from "../decorators";
import * as dayjs from 'dayjs'

@Injectable()
export class ApiResult {
  message<T = null>(
    data: T = null,
    code: number = 0,
    message: string = '请求成功'
  ): BaseResponseDto<T> {
    return {
      code,
      data,
      message,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      success: code === 0
    }
  }
}