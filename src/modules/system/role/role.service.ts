import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Role } from "./role.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ApiResult } from "@src/core/filters";
import { AddRoleDto, DeleteRoleDto, GetRoleListDto, UpdateRoleDto } from "./role.dto";
import { filterEmpty } from "@src/utils";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}
  apiResult = new ApiResult()

  async addRole(dto: AddRoleDto) {
    const { roleCode, roleName } = dto

    const isRoleCodeExist = await this.roleRepository.findOneBy({ roleCode })
    if (isRoleCodeExist) {
      throw new InternalServerErrorException('角色编码已存在')
    }
    const isRoleNameExist = await this.roleRepository.findOneBy({ roleName })
    if (isRoleNameExist) {
      throw new InternalServerErrorException('角色名称已存在')
    }

    try {
      await this.roleRepository.save({
        roleCode, roleName
      })
      return this.apiResult.message(null, 0, '新增成功')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }

  async updateRole(dto: UpdateRoleDto) {
    const { id, roleCode, roleName } = dto

    const isRoleExist = await this.roleRepository.findOneBy({ id })
    if (!isRoleExist) {
      throw new InternalServerErrorException('角色id不存在')
    }
    const isRoleCodeExist = await this.roleRepository.findOneBy({ roleCode })
    if (isRoleCodeExist) {
      throw new InternalServerErrorException('角色编码已存在')
    }
    const isRoleNameExist = await this.roleRepository.findOneBy({ roleName })
    if (isRoleNameExist) {
      throw new InternalServerErrorException('角色名称已存在')
    }
    const fields = filterEmpty({ roleCode, roleName })
    if (!Object.keys(fields).length) {
      throw new InternalServerErrorException('没有要修改的内容')
    }
    try {
      await this.roleRepository.update(
        id,
        fields
      )
      return this.apiResult.message(null, 0, '修改成功')
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async deleteRole(dto: DeleteRoleDto) {
    const { id } = dto
    try {
      await this.roleRepository.delete(id)
      return this.apiResult.message(null, 0, '删除成功')
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getRoleList(dto: GetRoleListDto) {
    const { pageNum = 1, pageSize = 10 } = dto
    
    const [list, total] = await this.roleRepository.findAndCount({
      order: {
        updateTime: 'desc'
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize
    })

    return this.apiResult.message({
      list,
      total,
      pageNum,
      pageSize
    })
  }
}