import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { GUARD_PUBLIC_KEY } from "../constants";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  // 白名单中的接口和加@Public装饰器的接口可直接放行，无需token校验
  private whiteList: string[] = []
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 设置是否允许公开访问
    const isAllowPublic = this.reflector.getAllAndOverride<boolean>(GUARD_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isAllowPublic) return true

    const request: Request = context.switchToHttp().getRequest() // 获取请求头

    // 白名单直接放行
    if (this.whiteList.includes(request.url)) return true

    const [type, content] = request.headers.authorization?.split(' ') ?? []
    const token = type === 'Bearer' ? content : undefined

    if (!token) throw new UnauthorizedException('token不能为空')
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET')
      })

      if (!payload.userId) {
        throw new InternalServerErrorException('未获取到用户id')
      }
      request['user'] = payload
    } catch {
      throw new UnauthorizedException('身份过期')
    }
    return true
  }
}