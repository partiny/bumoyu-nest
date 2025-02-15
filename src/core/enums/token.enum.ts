export enum TOKEN_ENUM {
  EXPIRED = 4001, // token过期，刷新token
  ILLEGAL = 4002, // token不合法，缺少必要的参数，重新登录
  MISS = 4003 // token缺失，重新登录
}