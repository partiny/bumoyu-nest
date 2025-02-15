import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { RequestContext } from "@src/core/decorators";
import { AddUserDto, AssignRoleToUserDto, DeleteUserDto, GetUserInfoByIdDto, GetUserListDto, UpdateUserDto, UpdateUserStatusDto } from "./user.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "./user.entity";
import { Role } from "../role/role.entity";
import { Like, Repository } from "typeorm";
import { ApiResult } from "@src/core/filters";
import { filterEmpty, getWhere, md5 } from "@src/utils";
import { JwtService } from "@nestjs/jwt";
import * as dayjs from 'dayjs'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  apiResult = new ApiResult()

  @Inject(JwtService)
  jwtService: JwtService

  async addUser(ctx: RequestContext, dto: AddUserDto) {
    const { userName, password, email, status, phone, nickName, source } = dto

    const isNameExist = await this.userRepository.findOneBy({ userName })
    if (isNameExist) {
      throw new InternalServerErrorException('用户名已存在')
    }
    if (email) {
      const isEmailExist = await this.userRepository.findOneBy({ email })
      if (isEmailExist) {
        throw new InternalServerErrorException('邮箱已注册')
      }
    }
    const fields = filterEmpty({
      userName,
      nickName,
      email,
      phone,
      status,
      password: md5(password), // 对密码进行加密（以防前端不加密）
      updatedBy: null,
      source
    })

    // 记录更新人id
    const token = ctx.headers.authorization
    if (token) {
      const payload = this.jwtService.decode(token.replace('Bearer ', '')) || {}
      if (payload.userId && this.userRepository.exists({ where: { id: payload.userId } })) {
        fields.updatedBy = payload.userId
      }
    }
    
    try {
      await this.userRepository.save(fields)
      return this.apiResult.message(null, 0, '新增成功')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }

  async updateUser(ctx: RequestContext, dto: UpdateUserDto) {
    const { id, userName, nickName, email, phone, status, source, password } = dto
    
    const isUserExist = await this.userRepository.findOneBy({ id })
    if (!isUserExist) {
      throw new InternalServerErrorException('userId不存在')
    }
    // 用户名不能修改
    const fields = filterEmpty({
      nickName,
      email,
      phone,
      status,
      updatedBy: null,
      source,
      password
    })

    if (!Object.keys(fields).length) {
      throw new InternalServerErrorException('没有要修改的内容')
    }
    if (fields.password) fields.password = md5(fields.password)

    const targetUser = await this.userRepository.findOne({
      where: { userName }
    })
    if (targetUser && targetUser.id !== id ) {
      throw new InternalServerErrorException('用户名已存在')
    }

    // 记录更新人id
    const token = ctx.headers.authorization
    if (token) {
      const payload = this.jwtService.decode(token.replace('Bearer ', '')) || {}
      if (payload.userId && this.userRepository.exists({ where: { id: payload.userId } })) {
        fields.updatedBy = payload.userId
      }
    }
    try {
      await this.userRepository.update(
        id,
        fields
      )
      return this.apiResult.message(null, 0, '修改成功')
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async updateUserStatus(ctx: RequestContext, dto: UpdateUserStatusDto) {
    const { id, status } = dto

    const fields = {
      status,
      updatedBy: null
    }
    // 记录更新人id
    const token = ctx.headers.authorization
    if (token) {
      const payload = this.jwtService.decode(token.replace('Bearer ', '')) || {}
      if (payload.userId && this.userRepository.exists({ where: { id: payload.userId } })) {
        fields.updatedBy = payload.userId
      }
    }
    try {
      await this.userRepository.update(
        id,
        { status }
      )
      return this.apiResult.message(null, 0, '修改成功')
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async deleteUser(dto: DeleteUserDto) {
    const { id } = dto
    try {
      await this.userRepository.update(id, { isDelete: 1 })
      return this.apiResult.message(null, 0, '删除成功')
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getUserList(dto: GetUserListDto) {
    const { pageNum = 1, pageSize = 10, userName = '', email = '' } = dto
    const [list, total] = await this.userRepository.findAndCount({
      where: {
        isDelete: 0,
        ...getWhere(userName, 'userName', Like(`%${userName}%`)),
        ...getWhere(email, 'email', Like(`%${email}%`))
      },
      order: {
        createTime: 'desc'
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize
    })

    type Modify<T, R> = {
      [P in keyof T]: P extends keyof R ? R[P]: T[P]
    }
    type ReUser = Modify<User, { lastLogin: string | number }>

    const reList: Partial<ReUser>[] = list.map(item => {
      const obj: Partial<ReUser> = { ...item }
      // bigint类型会被转为字符串，dayjs解析字符串会返回错误的时间，所以需要手动将字符串转为数字类型
      obj.lastLogin = item.lastLogin ? dayjs(Number(item.lastLogin)).format('YYYY-MM-DD HH:mm:ss') : null
      obj.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      return obj
    })
    return this.apiResult.message({
      list: reList,
      total,
      pageNum,
      pageSize
    })
  }

  async getUserInfoById(dto: GetUserInfoByIdDto) {
    const { id } = dto
    try {
      const user = await this.userRepository.findOneBy({ id, isDelete: 0 })
      if (!user) {
        return this.apiResult.message(null, 0, '用户不存在')
      }
      return this.apiResult.message(user)
    } catch(error) {
      throw new InternalServerErrorException(error)
    }
  }

  async assignRoleToUser(dto: AssignRoleToUserDto) {
    const { id, roleId } = dto
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role']
    })
    const role = await this.roleRepository.findOneBy({ id: roleId })
    if (!user) throw new InternalServerErrorException('用户id不存在')
    if (!role) throw new InternalServerErrorException('角色id不存在')

    try {
      user.role = role
      this.userRepository.save(user)
      return this.apiResult.message(null, 0, '用户角色已更新')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }
}