import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileService } from "./file.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from 'multer'

@ApiTags('文件')
@Controller('file')
export default class FileController {
  constructor(
    private readonly fileService: FileService
  ) {}

  @Post('process-local-link-file')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage()
  }))
  @ApiOperation({ summary: '处理本地链接分类文件' })
  async processLocalLinkFile(@UploadedFile() file) {
    return this.fileService.processLocalLinkFile(file.buffer)
  }

  @Post('process-local-itab-file')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage()
  }))
  @ApiOperation({ summary: '处理本地itab文件' })
  async processLocalITabFile(@UploadedFile() file) {
    return this.fileService.processLocalLinkFile(file.buffer)
  }
}