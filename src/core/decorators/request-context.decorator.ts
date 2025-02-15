import { IncomingHttpHeaders } from "http"
import { Request } from "express";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// jwtToken中保存的用户信息
export interface PayloadUser {
  userId: string;
  userName: string;
  nickName: string;
  avatar: string;
  email: string;
  phone: string;
  lastLogin: number;
  status: number;
  roleId: string;
  roleName: string;
  roleCode: string;
}

export class RequestContext {
  public requestId: string
  public url: string
  public ip: string
  public user: PayloadUser
  public headers: IncomingHttpHeaders
}

function createRequestContext(request: Request): RequestContext {
  const ctx = new RequestContext()
  ctx.url = request.url
  ctx.ip = request.ip
  ctx.headers = request.headers
  return ctx
}

export const ReqContext = createParamDecorator((data: unknown, ctx: ExecutionContext): RequestContext => {
  const request = ctx.switchToHttp().getRequest()
  return createRequestContext(request)
})