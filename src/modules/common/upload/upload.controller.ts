import { Controller, Post } from "@nestjs/common";
import { UploadService } from "./upload.service";

@Controller('common/upload')
export default class UploadController {
  constructor(
    private readonly uploadService: UploadService
  ) {}

  // 上传图片

  // 删除图片

  // 上传文件

  // 删除文件
}