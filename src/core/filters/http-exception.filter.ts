import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ApiResult } from "./api-result.filter";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception: HttpException,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = exception.message
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const eMessage = (exception.getResponse() as { message: string[] | null }).message
      if (eMessage && Array.isArray(eMessage) && eMessage.length) message = eMessage[0]
    }

    const apiResult = new ApiResult()
    const errorResponse = apiResult.message(null, status, message)
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status).json(errorResponse)
  }
}