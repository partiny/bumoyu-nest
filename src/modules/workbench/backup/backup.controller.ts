import { Body, Controller, Get, InternalServerErrorException, Post, Query, Req, StreamableFile } from "@nestjs/common";
import { BackupService } from "./backup.service";
import { ApiOperation } from "@nestjs/swagger";
import { RequestContext } from "@src/core/decorators";
import { GetBackupListDto } from "./backup.dto";
const contentDisposition = require('content-disposition')

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('manual-backup')
  @ApiOperation({ summary: '手动备份' })
  async manualBackup(@Req() { user }: RequestContext) {
    return this.backupService.manualBackup(user)
  }

  @Post('get-backup-list')
  @ApiOperation({ summary: '获取备份记录列表' })
  async getBackupList(@Req() { user }: RequestContext, @Body() dto: GetBackupListDto) {
    return this.backupService.getBackupList(user, dto)
  }

  @Post('delete-backup')
  @ApiOperation({ summary: '删除指定备份记录' })
  async deleteLinkCategory(@Req() { user }: RequestContext, @Body() { id }: { id: string }) {
    return this.backupService.deleteBackup(user, id);
  }

  @Get('get-backup-info-by-id')
  @ApiOperation({ summary: '通过id查询备份记录' })
  async getBackupInfoById(@Req() { user }: RequestContext, @Query() { id }: { id: string }) {
    return this.backupService.getBackupInfoById(user, id)
  }

  @Post('recover-backup')
  @ApiOperation({ summary: '恢复指定备份记录' })
  async recoverBackup(@Req() { user }: RequestContext, @Body() { id }: { id: string }) {
    return this.backupService.recoverBackup(user, id)
  }

  @Post('export-backup')
  @ApiOperation({ summary: '导出指定备份记录' })
  async exportBackup(
    @Req() { user }: RequestContext,
    @Body() { id }: { id: string }
  ) {
    try {
      const info = await this.backupService.exportBackup(user, id);
  
      const buffer = Buffer.from(JSON.stringify(info.data), 'utf-8');
      const cdHeader = contentDisposition(encodeURIComponent(info.fileName || '备份.bmy'), { type: 'attachment' });
      
      return new StreamableFile(buffer, {
        disposition: cdHeader,
        type: 'application/octet-stream'
      })
    } catch (error) {
      console.error('导出备份失败:', error);
      throw new InternalServerErrorException('导出备份失败');
    }
  }

  @Post('export-current-link-data')
  @ApiOperation({ summary: '导出当前链接分类数据' })
  async exportCurrentLinkData(@Req() { user }: RequestContext) {
    try {
      const data = await this.backupService.exportCurrentLinkData(user);
  
      const buffer = Buffer.from(JSON.stringify(data), 'utf-8');
      const cdHeader = contentDisposition(encodeURIComponent('备份.bmy'), { type: 'attachment' });
      
      return new StreamableFile(buffer, {
        disposition: cdHeader,
        type: 'application/octet-stream'
      })
    } catch (error) {
      console.error('导出备份失败:', error);
      throw new InternalServerErrorException('导出备份失败');
    }
  }
}