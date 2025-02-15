import * as crypto from 'crypto'

/**
 * 将字符串进行md5加密并返回
 * @param str 要加密的字符串
 * @returns 
 */
export function md5(str: string): string {
  if (!str) return ''
  return crypto.createHash('md5').update(str).digest('hex')
}