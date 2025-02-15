import { BadRequestException, Injectable } from "@nestjs/common";
import { ApiResult } from "@src/core/filters";

@Injectable()
export class FileService {
  constructor() {}
  apiResult = new ApiResult()

  async processLocalLinkFile(fileBuffer: Buffer) {
    if (!fileBuffer) {
      throw new BadRequestException('未找到要上传的文件')
    }
    try {
      const fileContent = fileBuffer.toString('utf-8')
      const jsonData = JSON.parse(fileContent)
      return this.apiResult.message(jsonData)
    } catch (error) {
      throw new BadRequestException(error || '不合法的文件格式')
    }
  }

}