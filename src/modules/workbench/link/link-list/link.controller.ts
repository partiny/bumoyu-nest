import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AddLinkDto, BatchAddLinksFromItabDto, DeleteLinkDto, GetLinkListDto, UpdateLinkDto, UpdateOrderOfLinksDto } from "./link.dto";
import { LinkService } from "./link.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RequestContext } from "@src/core/decorators";
import { AuthGuard } from "@src/core/guards";

@ApiTags('链接')
@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post('add-link')
  @ApiOperation({ summary: '新增链接' })
  async addLink(@Req() { user }: RequestContext, @Body() dto: AddLinkDto) {
    return this.linkService.addLink(user, dto)
  }

  @Post('update-link')
  @ApiOperation({ summary: '修改链接' })
  async updateLink(@Req() { user }: RequestContext, @Body() dto: UpdateLinkDto) {
    return this.linkService.updateLink(user, dto)
  }

  @Post('delete-link')
  @ApiOperation({ summary: '删除指定链接' })
  async deleteLink(@Req() { user }: RequestContext, @Body() dto: DeleteLinkDto) {
    return this.linkService.deleteLink(user, dto);
  }

  @Post('get-link-list')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '获取链接列表' })
  async getLinkList(@Req() { user }: RequestContext, @Body() dto: GetLinkListDto) {
    return this.linkService.getLinkList(user, dto)
  }

  @Post('get-link-tree-list')
  @ApiOperation({ summary: '获取所有分类下链接列表（树结构）' })
  async getLinkTreeList(@Req() { user }: RequestContext, @Body() dto: GetLinkListDto) {
    return this.linkService.getLinkTreeList(user, dto)
  }

  @Post('batch-add-links-from-itab')
  @ApiOperation({ summary: '批量导入iTab链接（追加）' })
  async batchAddLinksFromItab(@Req() { user }: RequestContext, @Body() dto: BatchAddLinksFromItabDto) {
    return this.linkService.batchAddLinksFromItab(user, dto)
  }

  @Post('batch-overlay-links-from-itab')
  @ApiOperation({ summary: '批量导入iTab链接（覆盖）' })
  async batchOverlayLinksFromItab(@Req() { user }: RequestContext, @Body() dto: BatchAddLinksFromItabDto) {
    return this.linkService.batchOverlayLinksFromItab(user, dto)
  }

  @Post('update-order-of-links')
  @ApiOperation({ summary: '修改链接排序' })
  async updateOrderOfLinks(@Req() { user }: RequestContext, @Body() dto: UpdateOrderOfLinksDto) {
    return this.linkService.updateOrderOfLinks(user, dto)
  }
}