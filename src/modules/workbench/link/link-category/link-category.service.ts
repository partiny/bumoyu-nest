import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Repository } from "typeorm";
import { LinkCategory } from "./link-category.entity";
import { AddLinkCategoryDto, DeleteLinkCategoryDto, GetLinkCategoryListDto, UpdateLinkCategoryDto, UpdateOrderOfCategorysDto } from './link-category.dto'
import { PayloadUser } from "@src/core/decorators";
import { JwtService } from "@nestjs/jwt";
import { User } from "@src/modules/system/user/user.entity";
import { filterEmpty, getWhere } from "@src/utils";
import { ApiResult } from "@src/core/filters";
import * as dayjs from "dayjs";
import { BackupService } from "../../backup/backup.service";

@Injectable()
export class LinkCategoryService {
  constructor(
    @InjectRepository(LinkCategory)
    private linkCategoryRepository: Repository<LinkCategory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly backupService: BackupService
  ) {}
  apiResult = new ApiResult()
  @Inject(JwtService)
  jwtService: JwtService

  /**新增链接分类 */
  async addLinkCategory(payload: PayloadUser, dto: AddLinkCategoryDto) {
    const { name, icon } = dto

    const user = await this.userRepository.findOneBy({ id: payload.userId, isDelete: 0 })
    if (!user) {
      throw new InternalServerErrorException('当前用户不存在')
    }
    const isCategoryExist = await this.linkCategoryRepository.findOneBy({ name })
    if (isCategoryExist) {
      throw new InternalServerErrorException('分类已存在')
    }

    const fields = filterEmpty({
      name,
      icon,
      userId: payload.userId,
      user,
    });
    try {
      console.log('新增分类成功')
      await this.linkCategoryRepository.save(fields)
      // 自动备份
      await this.backupService.automaticBackup('link-category-create', payload.userId)
      return this.apiResult.message(null, 0, '新增成功')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }
  /**修改链接分类 */
  async updateLinkCategory(payload: PayloadUser, dto: UpdateLinkCategoryDto) {
    const { id, name, icon } = dto

    const category = await this.linkCategoryRepository.findOne({ where: { id } })
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    if (category.userId !== payload.userId) {
      throw new ForbiddenException('无权修改该分类');
    }

    category.name = name ?? category.name
    category.icon = icon ?? category.icon
    try {
      await this.linkCategoryRepository.save(category);
      // 自动备份
      await this.backupService.automaticBackup('link-category-update', payload.userId)
      return this.apiResult.message(null, 0, '修改成功')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }
  /**删除指定链接分类 */
  async deleteLinkCategory(payload: PayloadUser, dto: DeleteLinkCategoryDto) {
    const { id } = dto

    const category = await this.linkCategoryRepository.findOne({ where: { id } })
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    if (category.userId !== payload.userId) {
      throw new ForbiddenException('无权删除该分类');
    }
    try {
      console.log('删除分类')
      await this.linkCategoryRepository.remove(category)
      // 自动备份
      await this.backupService.automaticBackup('link-category-delete', payload.userId)
      return this.apiResult.message(null, 0, '删除成功')
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
  /**获取链接分类列表 */
  async getLinkCategoryList(payload: PayloadUser, dto: GetLinkCategoryListDto) {
    const { name, pageNum = 1, pageSize = 10 } = dto
    const [list, total] = await this.linkCategoryRepository.findAndCount({
      where: {
        userId: payload.userId,
        ...getWhere(name, 'name', Like(`%${name}%`))
      },
      order: {
        sort: 'ASC',
        createTime: 'DESC'
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize
    })

    return this.apiResult.message({
      list: list.map(item => {
        delete item.updatedBy
        item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        item.links = (item.links || []).filter(sub => sub.type !== 'component')
        return item
      }),
      total,
      pageNum,
      pageSize
    })
  }
  /**获取所有链接分类列表（不带分页） */
  async getAllLinkCategoryList(payload: PayloadUser) {
    const data = await this.linkCategoryRepository.find({
      where: {
        userId: payload.userId
      },
      order: {
        sort: 'ASC',
        createTime: 'desc'
      }
    })

    return this.apiResult.message(data.map(item => ({
      name: item.name,
      icon: item.icon,
      id: item.id
    })))
  }
  /**修改链接分类排序 */
  async updateOrderOfCategorys(payload: PayloadUser, dto: UpdateOrderOfCategorysDto) {
    const { ids } = dto

    const user = await this.userRepository.findOneBy({ id: payload.userId, isDelete: 0 })
    if (!user) {
      throw new InternalServerErrorException('当前用户不存在')
    }
    const existingCategorys = await this.linkCategoryRepository.find({
      where: {
        id: In(ids),
        userId: payload.userId
      }
    })
    if (existingCategorys.length !== ids.length) {
      throw new Error('存在无效的分类id')
    }
    try {
      for (let i=0; i<ids.length; i++) {
        await this.linkCategoryRepository.createQueryBuilder()
          .update(LinkCategory)
          .set({ sort: i+1 })
          .where(
            'id = :id And userId = :userId',
            {
              id: ids[i],
              userId: payload.userId
            }
          )
          .execute()
      }
      // 自动备份
      await this.backupService.automaticBackup('link-category-update', payload.userId)
      return this.apiResult.message(null, 0, '修改成功')
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
}