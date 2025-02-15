import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { TOKEN_ENUM, USER_STATUS } from "@src/core/enums";
import { ApiResult } from "@src/core/filters";
import { Role } from "@src/modules/system/role/role.entity";
import { User } from "@src/modules/system/user/user.entity";
import { Repository } from "typeorm";
import { ResetPasswordDto, SignInDto, SignUpDto } from "./auth.dto";
import { md5 } from "@src/utils";
import axios from "axios";
import { MailDto } from "../mail/mail.dto";
import { MailService } from "../mail/mail.service";
import { RedisService } from "../redis/redis.service";
import { EMAIL_TEMPLATE } from "../mail/template/template.enum";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    private redisService: RedisService
  ) {}

  @Inject(JwtService)
  jwtService: JwtService

  apiResult = new ApiResult()

  async refreshToken(token: string) {
    if (!token) {
      return this.apiResult.message(null, TOKEN_ENUM.MISS, 'token缺失')
    }
    const payload = this.jwtService.decode(token.replace('Bearer ', ''))
    if (!payload) {
      return this.apiResult.message(null, TOKEN_ENUM.ILLEGAL, 'token不合法')
    }
    
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndMapOne('user.role', Role, 'role', 'user.roleId = role.id')
        .where({
          id: payload['userId'],
          isDelete: 0
        })
        .select([
          'user.id as userId',
          'user.userName as userName',
          'user.nickName as nickName',
          'user.avatar as avatar',
          'user.email as email',
          'user.phone as phone',
          'user.lastLogin as lastLogin',
          'user.status as status',
          'role.id as roleId',
          'role.roleName as roleName',
          'role.roleCode as roleCode'
        ])
        .getRawOne()
      
      if (!user) {
        return this.apiResult.message(null, TOKEN_ENUM.ILLEGAL, 'token不合法')
      }
      
      return this.getToken(user)
    } catch(error) {
      throw new InternalServerErrorException(error || 'token刷新失败')
    }
  }

  // 生成双token
  private getToken(payload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    })
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    })

    return this.apiResult.message({
      accessToken,
      refreshToken
    }, 0)
  }
  /**登录 */
  async signIn(dto: SignInDto) {
    const { userName, password } = dto

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndMapOne('user.role', Role, 'role', 'user.roleId = role.id' )
      .where({
        userName,
        isDelete: 0
      })
      .select([
        'user.id as userId',
        'user.userName as userName',
        'user.password as password',
        'user.nickName as nickName',
        'user.avatar as avatar',
        'user.email as email',
        'user.phone as phone',
        'user.lastLogin as lastLogin',
        'user.status as status',
        'role.id as roleId',
        'role.roleName as roleName',
        'role.roleCode as roleCode'
      ])
      .getRawOne()

    if (!user) {
      throw new InternalServerErrorException('用户未注册')
    }
    if (user.password !== md5(password)) {
      throw new InternalServerErrorException('密码错误，请重新输入')
    }

    if (user.status === USER_STATUS.DISABLE) {
      throw new InternalServerErrorException('当前用户已停用')
    }

    await this.userRepository.update(user.userId, { "lastLogin": Date.now() })

    delete user.password

    return this.getToken(user)
  }
  
  /**注册 */
  async signUp(dto: SignUpDto) {
    const { userName, password, email, source, verificationCode } = dto

    // 检查验证码是否正确
    const isCodeValid = await this.verifyEmailCode(email, verificationCode, EMAIL_TEMPLATE.registAccount);
    if (!isCodeValid) {
      throw new BadRequestException('验证码无效或已过期');
    }

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
    const fields = {
      userName,
      password: md5(password),
      email,
      source
    }
    try {
      await this.userRepository.save(fields)
      return this.apiResult.message(null, 0, '注册成功')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }

  async proxy(url: string) {
    try {
      const res = await axios.get(url)
      return this.apiResult.message(res.data)
    } catch {
      return this.apiResult.message({})
    }
  }

  /**注册时发送邮箱验证码 */
  async sendEmailVerificationCode(dto: MailDto) {
    const { email } = dto
    if (dto.type === EMAIL_TEMPLATE.registAccount) {
      const isEmailExist = await this.userRepository.findOneBy({ email })
      if (isEmailExist) {
        throw new InternalServerErrorException('邮箱已注册')
      }
    }

    await this.mailService.sendVerificationCode(dto)
    return this.apiResult.message()
  }
  /**判断验证码是否有效 */
  async verifyEmailCode(
    email: string,
    code: string,
    type: EMAIL_TEMPLATE = EMAIL_TEMPLATE.registAccount
  ) {
    const key = `${type}_verification:${email}`;
    const storedCode = await this.redisService.get(key);
    if (!storedCode || storedCode !== code) {
      return false
    }
    // 如果验证成功，删除Redis中的验证码
    await this.redisService.del(key)
    return true
  }
  /**重置密码 */
  async resetPassword(dto: ResetPasswordDto) {
    const { email, password, verificationCode } = dto

    // 检查验证码是否正确
    const isCodeValid = await this.verifyEmailCode(email, verificationCode, EMAIL_TEMPLATE.resetPassword);
    if (!isCodeValid) {
      throw new BadRequestException('验证码无效或已过期');
    }

    const user = await this.userRepository.findOneBy({ email })
    if (!user) {
      throw new InternalServerErrorException('邮箱不存在')
    }
    console.log(password)
    try {
      await this.userRepository.update(user.id, { password: md5(password) })
      return this.apiResult.message(null, 0, '密码重置成功')
    } catch(e) {
      throw new InternalServerErrorException(e)
    }
  }
}