import { ForbiddenException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Like, Repository } from "typeorm";
import { Link } from "./link.entity";
import { AddLinkDto, BatchAddLinksFromItabDto, DeleteLinkDto, GetLinkListDto, UpdateLinkDto, UpdateOrderOfLinksDto } from "./link.dto";
import { LinkCategory } from "../link-category/link-category.entity";
import { PayloadUser } from "@src/core/decorators";
import { ApiResult } from "@src/core/filters";
import { JwtService } from "@nestjs/jwt";
import { getWhere } from "@src/utils";
import { User } from "@src/modules/system/user/user.entity";
import * as dayjs from 'dayjs'
import { formatLinkList } from "../tool";
import { BackupService } from "../../backup/backup.service";

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
    @InjectRepository(LinkCategory)
    private linkCategoryRepository: Repository<LinkCategory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    @Inject(forwardRef(() => BackupService))
    private readonly backupService: BackupService
  ) {}

  apiResult = new ApiResult()
  @Inject(JwtService)
  jwtService: JwtService
  /**新增链接 */
  async addLink(payload: PayloadUser, dto: AddLinkDto) {
    try {
      await this.linkRepository.save(dto)
      // 自动备份
      await this.backupService.automaticBackup('link-create', payload.userId)
      return this.apiResult.message(null, 0, '新增成功')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }
  /**修改链接 */
  async updateLink(payload: PayloadUser, dto: UpdateLinkDto) {
    const { id, categoryId } = dto
    const link = await this.linkRepository.findOne({ where: { id } })
    if (!link) {
      throw new NotFoundException('链接不存在')
    }

    const user = await this.userRepository.findOneBy({ id: payload.userId, isDelete: 0 })
    if (!user) {
      throw new InternalServerErrorException('当前用户不存在')
    }

    const category = await this.linkCategoryRepository.findOne({ where: { id: categoryId, userId: payload.userId } })
    if (!category) {
      throw new ForbiddenException('无权修改该链接');
    }
    this.linkRepository.merge(link, dto)
    try {
      await this.linkRepository.save(link)
      // 自动备份
      await this.backupService.automaticBackup('link-update', payload.userId)
      return this.apiResult.message(null, 0, '修改成功')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }
  /**删除指定链接 */
  async deleteLink(payload: PayloadUser, dto: DeleteLinkDto) {
    const { id } = dto

    const link = await this.linkRepository.findOne({ where: { id } })
    if (!link) {
      throw new NotFoundException('链接不存在');
    }
   
    const user = await this.userRepository.findOneBy({ id: payload.userId, isDelete: 0 })
    if (!user) {
      throw new InternalServerErrorException('当前用户不存在')
    }

    const category = await this.linkCategoryRepository.findOne({ where: { id: link.categoryId, userId: payload.userId } })
    if (!category) {
      throw new ForbiddenException('无权修改该链接');
    }

    try {
      await this.linkRepository.remove(link)
      // 自动备份
      await this.backupService.automaticBackup('link-delete', payload.userId)
      return this.apiResult.message(null, 0, '删除成功')
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
  /**获取所有分类下链接列表（树结构） */
  async getLinkTreeList(payload: PayloadUser, dto: GetLinkListDto) {
    const user = await this.userRepository.findOneBy({ id: payload.userId, isDelete: 0 })
    if (!user) {
      throw new InternalServerErrorException('当前用户不存在')
    }
    
    const { name, categoryId, pageNum = 1, pageSize = 999 } = dto
    const [list, total] = await this.linkCategoryRepository.findAndCount({
      where: {
        userId: payload.userId,
        ...getWhere(categoryId, 'id', categoryId),
        ...getWhere(name, 'name', Like(`%${name}%`))
      },
      order: {
        sort: 'ASC',
        createTime: 'asc'
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      relations: ['links']
    })
    return this.apiResult.message({
      list: formatLinkList(list),
      total,
      pageNum,
      pageSize
    })
  }
  /**获取链接列表 */
  async getLinkList(payload: PayloadUser, dto: GetLinkListDto) {
    const user = await this.userRepository.findOneBy({ id: payload.userId, isDelete: 0 })
    if (!user) {
      throw new InternalServerErrorException('当前用户不存在')
    }
    
    const { name, categoryId, pageNum = 1, pageSize = 999 } = dto
    const query = this.entityManager
      .createQueryBuilder(Link, 'link')
      .leftJoinAndSelect('link.category', 'category')
      .where('category.userId= :userId', { userId: payload.userId })
      .orderBy('link.sort', 'ASC')
      .orderBy('link.createTime', 'DESC')
    if (name) {
      query.andWhere('link.name LIKE :name', { name: `%${name}%` })
    }
    if (categoryId) {
      query.andWhere('link.categoryId = :categoryId', { categoryId })
    }

    const total = await query.getCount()
    const links = await query.skip((pageNum - 1) * pageSize).take(pageSize).getMany()

    const formattedList = links.map(item => {
      const obj = { ...item }
      delete obj.updatedBy
      delete obj.category
      // delete obj.sort
      obj.createTime = dayjs(obj.createTime).format('YYYY-MM-DD HH:mm:ss')
      return {
        categoryName: item.category.name,
        ...obj
      }
    })
    
    return this.apiResult.message({
      list: formattedList,
      total,
      pageNum,
      pageSize
    })
  }

  // @Transactional()
  /**批量导入iTab链接（追加） */
  async batchAddLinksFromItab(payload: PayloadUser, dto: BatchAddLinksFromItabDto) {
    const { list } = dto
    if (!list?.length) {
      throw new InternalServerErrorException('链接不能为空')
    }
  
    const user = await this.userRepository.findOneBy({ id: payload.userId, isDelete: 0 })
    if (!user) {
      throw new InternalServerErrorException('当前用户不存在')
    }

    const categories = this.linkCategoryRepository.create(
      list.map((link, index) => ({
        name: link.name,
        icon: link.icon,
        userId: payload.userId,
        sort: index + 1
      }))
    );

    await this.linkCategoryRepository.save(categories);

    const links = [];
    for (const [index, category] of categories.entries()) {
      list[index].children.forEach((linkDto, subIndex) => {
        links.push(
          this.linkRepository.create({
            url: linkDto.url,
            name: linkDto.name,
            src: linkDto.src,
            type: linkDto.type,
            iconText: linkDto.iconText,
            backgroundColor: linkDto.backgroundColor,
            view: linkDto.view,
            categoryId: category.id,
            sort: subIndex + 1
          })
        );
      })
    }

    try {
      await this.linkRepository.save(links)
      // 自动备份
      await this.backupService.automaticBackup('link-import-add', payload.userId)
      return this.apiResult.message(null, 0, '导入成功')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }

  /**
   * 清空指定用户下的所有分类和链接
   */
  async clearCategoryDataByUserId(userId: string) {
    // 获取当前用户的所有分类
    const userCategories = await this.linkCategoryRepository.find({ where: { userId } })
    // 获取这些分类的所有链接
    const categoryIds = userCategories.map(category => category.id)
    await this.linkRepository.delete({ categoryId: In(categoryIds) })
    // 清空用户的分类
    await this.linkCategoryRepository.delete({ userId })
  }

  /**
   * 批量导入iTab链接（覆盖）
   */
  async batchOverlayLinksFromItab(payload: PayloadUser, dto: BatchAddLinksFromItabDto) {
    const { list } = dto
    if (!list?.length) {
      throw new InternalServerErrorException('链接不能为空')
    }

    const user = await this.userRepository.findOneBy({ id: payload.userId, isDelete: 0 })
    if (!user) {
      throw new InternalServerErrorException('当前用户不存在')
    }

    await this.clearCategoryDataByUserId(payload.userId)

    const  categories = list.map((categoryDto, index) =>
      this.linkCategoryRepository.create({
        name: categoryDto.name,
        icon: categoryDto.icon,
        userId: payload.userId,
        sort: index + 1
      })
    )
    await this.linkCategoryRepository.save(categories)

    const links = [];
    for (const [index, category] of categories.entries()) {
      list[index].children.forEach((linkDto, subIndex) => {
        links.push(
          this.linkRepository.create({
            url: linkDto.url,
            name: linkDto.name,
            src: linkDto.src,
            type: linkDto.type,
            iconText: linkDto.iconText,
            backgroundColor: linkDto.backgroundColor,
            view: linkDto.view,
            categoryId: category.id,
            sort: subIndex + 1
          })
        );
      })
    }

    try {
      await this.linkRepository.save(links)
      // 自动备份
      await this.backupService.automaticBackup('link-import-cover', payload.userId)
      return this.apiResult.message(null, 0, '导入成功')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }
  /**修改链接排序 */
  async updateOrderOfLinks(payload: PayloadUser, dto: UpdateOrderOfLinksDto) {
    const { categoryId, linkIds } = dto

    const user = await this.userRepository.findOneBy({ id: payload.userId, isDelete: 0 })
    if (!user) {
      throw new InternalServerErrorException('当前用户不存在')
    }

    const existingLinks = await this.linkRepository.find({
      where: {
        id: In(linkIds),
        categoryId
      }
    })
    if (existingLinks.length !== linkIds.length) {
      throw new Error('存在无效的链接id')
    }

    try {
      for(let i=0; i<linkIds.length; i++) {
        await this.linkRepository.createQueryBuilder()
          .update(Link)
          .set({ sort: i+1 })
          .where(
            'id = :id AND categoryId = :categoryId',
            {
              id: linkIds[i],
              categoryId
            }
          )
          .execute()
      }
      // 自动备份
      await this.backupService.automaticBackup('link-update', payload.userId)
      return this.apiResult.message(null, 0, '修改成功')
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
}