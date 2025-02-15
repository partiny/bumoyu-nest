import { ForbiddenException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Backup, backupType, type BackupType } from "./backup.entity";
import { EntityManager, Repository } from "typeorm";
import { LinkCategory } from "../link/link-category/link-category.entity";
import { Link } from "../link/link-list/link.entity";
import { PayloadUser } from "@src/core/decorators";
import { User } from "@src/modules/system/user/user.entity";
import { ApiResult } from "@src/core/filters";
import { formatLinkList } from "../link/tool";
import { GetBackupListDto } from "./backup.dto";
import * as dayjs from 'dayjs'
import { LinkService } from "../link/link-list/link.service";

@Injectable()
export class BackupService {
  constructor(
    @InjectRepository(Backup)
    private readonly backupRepository: Repository<Backup>,
    @InjectRepository(LinkCategory)
    private readonly linkCategoryRepository: Repository<LinkCategory>,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    @Inject(forwardRef(() => LinkService))
    private readonly linkService: LinkService
  ){}

  apiResult = new ApiResult()

  /**手动备份 */
  async manualBackup(payload: PayloadUser) {
     const user = await this.userRepository.findOneBy({ id: payload.userId, isDelete: 0 })
    if (!user) {
      throw new InternalServerErrorException('当前用户不存在')
    }

    try {
      await this.automaticBackup('manual', payload.userId)
      return this.apiResult.message(null, 0, '备份成功')
    } catch(e) {
      console.error('备份失败:', e); // 记录错误日志
      throw new InternalServerErrorException(e)
    }
  }
  
  /**查看备份记录（带分页） */
  async getBackupList(payload: PayloadUser, dto: GetBackupListDto) {
    const { pageNum = 1, pageSize = 10 } = dto
    const [list, total] = await this.backupRepository.findAndCount({
      where: {
        userId: payload.userId
      },
      order: {
        createTime: 'DESC'
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize
    })
    const formatList = list.map(item => ({
      id: item.id,
      createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
      typeName: backupType[item.type]
    }))
    return this.apiResult.message({
      list: formatList,
      total,
      pageNum,
      pageSize
    })
  }
  /**删除指定备份记录 */
  async deleteBackup(payload: PayloadUser, id: string) {
    const backup = await this.backupRepository.findOne({ where: { id } })
    if (!backup) {
      throw new NotFoundException('备份记录不存在');
    }
    if (backup.userId !== payload.userId) {
      throw new ForbiddenException('无权删除该备份记录');
    }
    try {
      await this.backupRepository.remove(backup)
      return this.apiResult.message(null, 0, '删除成功')
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }
  /**通过id查询备份记录 */
  async getBackupInfoById(payload: PayloadUser, id: string) {
    const backup = await this.backupRepository.findOne({ where: { id } })
    if (!backup) {
      throw new NotFoundException('备份记录不存在');
    }
    if (backup.userId !== payload.userId) {
      throw new ForbiddenException('无权查看该备份记录');
    }
    return this.apiResult.message({
      id: backup.id,
      createTime: dayjs(backup.createTime).format('YYYY-MM-DD HH:mm:ss'),
      typeName: backupType[backup.type],
      data: backup.data
    })
  }
  /**恢复指定备份记录 */
  async recoverBackup(payload: PayloadUser, id: string) {
    const backup = await this.backupRepository.findOne({ where: { id } })
    if (!backup) {
      throw new NotFoundException('备份记录不存在');
    }
    if (backup.userId !== payload.userId) {
      throw new ForbiddenException('无权恢复该备份记录');
    }
    
    await this.linkService.clearCategoryDataByUserId(payload.userId)

    const list = backup.data?.navConfig || []
    const links = []
    list.forEach(item => {
      if (item.children?.length) {
        links.push(...item.children)
      }
    })
    const categories = [...list].map(item => {
      delete item.children
      item.userId = payload.userId
      return item
    })
    await this.linkCategoryRepository.save(categories)
    await this.linkRepository.save(links)
    return this.apiResult.message(null)
  }
  /**导出指定备份记录 */
  async exportBackup(payload: PayloadUser, id: string) {
    const backup = await this.backupRepository.findOne({ where: { id } })
    if (!backup) {
      throw new NotFoundException('备份记录不存在');
    }
    if (backup.userId !== payload.userId) {
      throw new ForbiddenException('无权下载该备份记录');
    }

    return {
      data: backup.data,
      fileName: `备份记录${dayjs(backup.createTime).format('YYYY-MM-DD_HH_mm')}.bmy`
    }
  }
  /**导出当前链接分类数据 */
  async exportCurrentLinkData(payload: PayloadUser) {
    return this.getBackupData(payload.userId)
  }

  /**在新增/删除/编辑的时候自动备份 */
  async automaticBackup(backupType: BackupType, userId: string) {
    const backupRecord = new Backup();
    backupRecord.type = backupType;
    backupRecord.userId = userId;
    backupRecord.data = await this.getBackupData(userId);

    try {
      await this.entityManager.getRepository(Backup).save(backupRecord);
      console.log('备份成功', backupType)
    } catch (error) {
      console.error('备份失败:', error);
    }
  }
  // 获取要备份的链接数据
  private async getBackupData(userId: string) {
    const categories = await this.entityManager.getRepository(LinkCategory).find({
      where: { userId },
      order: {
        sort: 'ASC',
        createTime: 'asc'
      },
      relations: ['links'],
    });
    return {
      navConfig: formatLinkList(categories)
    };
  }
}