/**
 * 用于合并数据库查询where语句
 * @param value 查询值，如：dto.userName
 * @param key 要查询的数据库key，如：userName
 * @param condition 要查询的条件，如：Like(`%${userName}%`)
 * @returns 
 */
export function getWhere(value: unknown, key: string, condition) {
  return value ? { [key]: condition } : {}
}