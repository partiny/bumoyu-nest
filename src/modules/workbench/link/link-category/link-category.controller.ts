import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { User } from "@src/modules/system/user/user.entity";
import { LinkCategoryService } from "./link-category.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RequestContext } from "@src/core/decorators";
import { AddLinkCategoryDto, DeleteLinkCategoryDto, GetLinkCategoryListDto, UpdateLinkCategoryDto, UpdateOrderOfCategorysDto } from "./link-category.dto";

@ApiTags('链接分类')
@Controller('link')
export class LinkCategoryController {
  constructor(private readonly linkCategoryService: LinkCategoryService) {}

  @Post('add-link-category')
  @ApiOperation({ summary: '新增链接分类' })
  async addLinkCategory(@Req() { user }: RequestContext, @Body() dto: AddLinkCategoryDto) {
    return this.linkCategoryService.addLinkCategory(user, dto)
  }

  @Post('update-link-category')
  @ApiOperation({ summary: '修改链接分类' })
  async updateLinkCategory(@Req() { user }: RequestContext, @Body() dto: UpdateLinkCategoryDto) {
    return this.linkCategoryService.updateLinkCategory(user, dto)
  }

  @Post('delete-link-category')
  @ApiOperation({ summary: '删除指定链接分类' })
  async deleteLinkCategory(@Req() { user }: RequestContext, @Body() dto: DeleteLinkCategoryDto) {
    return this.linkCategoryService.deleteLinkCategory(user, dto);
  }

  @Post('get-link-category-list')
  @ApiOperation({ summary: '获取链接分类列表' })
  async getLinkCategoryList(@Req() { user }: RequestContext, @Body() dto: GetLinkCategoryListDto) {
    return this.linkCategoryService.getLinkCategoryList(user, dto)
  }

  @Get('get-all-link-category-list')
  @ApiOperation({ summary: '获取所有链接分类列表（不带分页）' })
  async getAllLinkCategoryList(@Req() { user }: RequestContext) {
    return this.linkCategoryService.getAllLinkCategoryList(user)
  }

  @Post('update-order-of-categorys')
  @ApiOperation({ summary: '修改分类排序' })
  async updateOrderOfCategorys(@Req() { user }: RequestContext, @Body() dto: UpdateOrderOfCategorysDto) {
    return this.linkCategoryService.updateOrderOfCategorys(user, dto)
  }
}